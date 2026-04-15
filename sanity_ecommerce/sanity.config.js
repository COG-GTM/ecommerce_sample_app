import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'

import product from './schemas/product'
import banner from './schemas/banner'

export default defineConfig({
  name: 'default',
  title: 'ecommerce',

  projectId: 'vfxfwnaw',
  dataset: 'production',

  plugins: [structureTool(), visionTool()],

  schema: {
    types: [product, banner],
  },
})
