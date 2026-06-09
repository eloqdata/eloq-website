import React from 'react';
import Head from '@docusaurus/Head';

function serializeSchema(schema) {
  return JSON.stringify(schema).replace(/</g, '\\u003c');
}

export default function StructuredData({schemas = []}) {
  if (!schemas.length) {
    return null;
  }

  return (
    <Head>
      {schemas.map((schema, index) => (
        <script
          key={schema['@id'] || `${schema['@type']}-${index}`}
          type="application/ld+json">
          {serializeSchema(schema)}
        </script>
      ))}
    </Head>
  );
}
