import { api } from '../api.js';

export interface AddWordResponse {
	words: Array<{ id: number; word: string }>;
	error?: string;
}

export interface GetWordsResponse {
	words: Array<{ id: number; word: string }>;
}

export interface EditWordResponse {
	success: string;
	error?: string;
}

// Funciones de API para el juego
export const wordApi = {
	addWord: async (word: string): Promise<AddWordResponse> => {
		return api.post<AddWordResponse>(
			'/api/words/add-word',
			{ word: word },
			{
				useFormData: true
			}
		);
	},

	getWords: async (): Promise<GetWordsResponse> => {
		return api.get<GetWordsResponse>('/api/words/get-words');
	},

	deleteWord: async (word_id: number): Promise<{ success: boolean; error?: string }> => {
		return api.delete<{ success: boolean; error?: string }>(
			'/api/words/remove-word',
			{ word_id: word_id },
			{
				useFormData: true
			}
		);
	},

	editWord: async (word_id: number, new_word: string): Promise<EditWordResponse> => {
		return api.patch<EditWordResponse>(
			'/api/words/edit-word',
			{ word_id: word_id, new_word: new_word },
			{
				useFormData: true
			}
		);
	}
};
