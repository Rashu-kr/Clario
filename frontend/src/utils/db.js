import localforage from 'localforage';

// Configure localforage to create a dedicated IndexedDB store
const clarioStore = localforage.createInstance({
  name: 'ClarioDocuments',
  storeName: 'documents_history'
});

/**
 * Saves a document analysis record. Generates an ID if not present.
 */
export async function saveDocument(doc) {
  try {
    const id = doc.id || `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const record = {
      ...doc,
      id,
      created_at: doc.created_at || new Date().toISOString()
    };
    await clarioStore.setItem(id, record);
    return record;
  } catch (error) {
    console.error('Error saving document to IndexedDB:', error);
    throw error;
  }
}

/**
 * Retrieves all saved documents for a specific user email.
 */
export async function getDocuments(userEmail) {
  try {
    const documents = [];
    await clarioStore.iterate((value) => {
      // Group/filter by user email if available
      if (!userEmail || value.user_email === userEmail) {
        documents.push(value);
      }
    });
    // Sort by creation date descending (newest first)
    return documents.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  } catch (error) {
    console.error('Error fetching documents from IndexedDB:', error);
    return [];
  }
}

/**
 * Deletes a document by ID.
 */
export async function deleteDocument(docId) {
  try {
    await clarioStore.removeItem(docId);
    return true;
  } catch (error) {
    console.error('Error deleting document from IndexedDB:', error);
    throw error;
  }
}

/**
 * Appends or updates the chat log history for an active session.
 */
export async function updateChatHistory(docId, messages) {
  try {
    const doc = await clarioStore.getItem(docId);
    if (doc) {
      doc.messages = messages;
      await clarioStore.setItem(docId, doc);
    }
  } catch (error) {
    console.error('Error updating chat history in IndexedDB:', error);
  }
}
