#!/usr/bin/env node
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {createDraft, listDrafts, loadBrief, plan, publishDraft, reviewDraft, validateDraft} from './lib.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const [command = 'help', ...args] = process.argv.slice(2);
const options = {};
for (let index = 0; index < args.length; index += 2) {
  if (!args[index].startsWith('--') || !args[index + 1] || args[index + 1].startsWith('--')) throw new Error('Options require --name value pairs');
  options[args[index].slice(2)] = args[index + 1];
}
const required = key => { if (!options[key]) throw new Error(`Missing --${key}`); return options[key]; };
const print = value => console.log(JSON.stringify(value, null, 2));
try {
  switch (command) {
    case 'plan': print(await plan(root)); break;
    case 'scaffold':
    case 'generate':
    case 'refresh': {
      const brief = await loadBrief(root, required('brief'));
      if (command === 'refresh' && brief.operation !== 'refresh') throw new Error('refresh requires a brief with operation: refresh and an existing article path');
      print(await createDraft(root, brief, {ai: command !== 'scaffold', apiKey: process.env.OPENAI_API_KEY, model: process.env.OPENAI_CONTENT_MODEL}));
      break;
    }
    case 'daily': {
      if (process.env.CONTENT_AUTOMATION_ENABLED !== 'true') throw new Error('Daily generation is disabled. Set CONTENT_AUTOMATION_ENABLED=true after configuring the editorial queue.');
      const planned = await plan(root);
      if (!planned.next) { print({status: 'skipped', reason: planned.reason}); break; }
      const brief = await loadBrief(root, planned.next.path);
      print(await createDraft(root, brief, {ai: true, apiKey: process.env.OPENAI_API_KEY, model: process.env.OPENAI_CONTENT_MODEL}));
      break;
    }
    case 'validate': {
      const drafts = options.draft ? [{path: options.draft}] : (await listDrafts(root)).filter(draft => draft.status !== 'published');
      const results = [];
      for (const draft of drafts) {
        try { results.push({draft: draft.path, errors: (await validateDraft(root, draft.path)).errors}); }
        catch (error) { results.push({draft: draft.path, errors: [error.message]}); }
      }
      print({checked: results.length, results});
      if (results.some(result => result.errors.length)) process.exitCode = 1;
      break;
    }
    case 'review': print(await reviewDraft(root, required('draft'), required('reviewer'), required('notes'))); break;
    case 'publish': print(await publishDraft(root, required('draft'))); break;
    default:
      if (command !== 'help') throw new Error(`Unknown command: ${command}`);
      console.log(`EloqData editorial CLI (run from any directory)\n\n  plan\n  scaffold --brief content/briefs/<id>.json\n  generate --brief content/briefs/<id>.json\n  refresh --brief content/briefs/<id>.json\n  validate [--draft content/drafts/<id>]\n  review --draft content/drafts/<id> --reviewer "Name" --notes "Evidence checked"\n  publish --draft content/drafts/<id>\n  daily\n\nScaffold and all editorial operations work offline. Generation uses the selected source\nfiles with OPENAI_API_KEY and OPENAI_CONTENT_MODEL. Publishing only changes local files.\nSee docs/CONTENT_WORKFLOW.md.`);
  }
} catch (error) {
  console.error(`Content workflow: ${error.message}`);
  process.exitCode = 1;
}
