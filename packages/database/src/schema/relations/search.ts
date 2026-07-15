import { relations } from 'drizzle-orm';
import { searchIndices } from '../tables/search_indices';
import { searchDocuments } from '../tables/search_documents';

export const searchIndexRelations = relations(searchIndices, ({ many }) => ({
  documents: many(searchDocuments),
}));

export const searchDocumentRelations = relations(searchDocuments, ({ one }) => ({
  index: one(searchIndices, {
    fields: [searchDocuments.indexId],
    references: [searchIndices.id],
  }),
}));
