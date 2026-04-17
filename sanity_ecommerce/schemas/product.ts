interface SanityFieldOptions {
  hotspot?: boolean;
  source?: string;
  maxLength?: number;
}

interface SanityField {
  name: string;
  title: string;
  type: string;
  of?: { type: string }[];
  options?: SanityFieldOptions;
}

interface SanitySchemaDefinition {
  name: string;
  title: string;
  type: string;
  fields: SanityField[];
}

const product: SanitySchemaDefinition = {
  name: 'product',
  title: 'Product',
  type: 'document',
  fields: [
    {
      name: 'image',
      title: 'Image',
      type: 'array',
      of: [{ type: 'image' }],
      options: {
        hotspot: true,
      }
    },
    { 
      name: 'name',
      title: 'Name',
      type: 'string',
    },
    { 
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 90,
      }
    },
    { 
      name: 'price',
      title: 'Price',
      type: 'number',
    },
    { 
      name: 'details',
      title: 'Details',
      type: 'string',
    }
  ]
};

export default product;
