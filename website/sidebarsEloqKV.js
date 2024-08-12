/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */

// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  // By default, Docusaurus generates a sidebar from the docs folder structure
  eloqkv: {
    'EloqKV Introduction': ['introduction'],
    'Get Started': ['install-from-binary', 'docker-deploy'],
    Deploy: [
      'quick-start',
      'quick-start-ha',
      'manage-cluster',
      'upgrade',
      'prerequisite',
      {
        type: 'category',
        label: 'Deploy on AWS EKS',
        items: [
          'eks-deployment',
          'deployment-eloq-kv-aws-eks',
          'configure-eloqkv-resource',
        ],
      },
    ],
    Monitor: ['monitor'],
    'Redis Comaptibility': ['kvstore_compatibility'],
    'Command Reference': [
      {
        type: 'category',
        label: 'Lists',
        items: [
          'list/LINDEX',
          'list/LINSERT',
          'list/LLEN',
          'list/LMOVE',
          'list/LMPOP',
          'list/LPOP',
          'list/LPOS',
          'list/LPUSH',
          'list/LPUSHX',
          'list/LRANGE',
          'list/LREM',
          'list/LSET',
          'list/LTRIM',
          'list/LRPOP',
          'list/LRPUSH',
          'list/LRPUSHX',
        ],
      },
      {
        type: 'category',
        label: 'Hashes',
        items: [
          'hash/HDEL',
          'hash/HEXISTS',
          'hash/HGET',
          'hash/HGETALL',
          'hash/HINCRBY',
          'hash/HINCRBYFLOAT',
          'hash/HKEYS',
          'hash/HLEN',
          'hash/HMGET',
          'hash/HSET',
          'hash/HSETNX',
          'hash/HSTRLEN',
          'hash/HVALS',
          'hash/HRANDFIELD',
          'hash/HSCAN',
          'hash/HMSET',
        ],
      },
      {
        type: 'category',
        label: 'Sets',
        items: [
          'set/SADD',
          'set/SCARD',
          'set/SDIFF',
          'set/SDIFFSTORE',
          'set/SINTER',
          'set/SINTERSTORE',
          'set/SISMEMBER',
          'set/SMEMBERS',
          'set/SMISMEMBER',
          'set/SMOVE',
          'set/SPOP',
          'set/SRANDMEMBER',
          'set/SREM',
          'set/SSCAN',
        ],
      },
    ],
  },
};
module.exports = sidebars;
