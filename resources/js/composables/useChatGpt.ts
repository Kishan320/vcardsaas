import { ref } from 'vue';
import axios from 'axios';

interface UseChatGptOptions {
  onSuccess?: (content: string) => void;
  onError?: (error: string) => void;
}

export function useChatGpt(options: UseChatGptOptions = {}) {
  const isModalOpen = ref(false);
  const isLoading = ref(false);

  const openModal = () => isModalOpen.value = true;
  const closeModal = () => isModalOpen.value = false;

  const generateContent = async (prompt: string): Promise<string | null> => {
    if (!prompt.trim()) {
      console.error('Please enter a prompt');
      return null;
    }

    isLoading.value = true;
    try {
      const response = await axios.post((window as any).route('chatgpt.generate'), { prompt });

      if (response.status === 200) {
        options.onSuccess?.(response.data.content);
        return response.data.content;
      } else {
        const errorMessage = response.data.message || 'Failed to generate content';
        console.error(errorMessage);
        options.onError?.(errorMessage);
        return null;
      }
    } catch (error) {
      const errorMessage = 'Error connecting to AI service';
      console.error(errorMessage);
      options.onError?.(errorMessage);
      return null;
    } finally {
      isLoading.value = false;
    }
  };

  return {
    isModalOpen,
    isLoading,
    openModal,
    closeModal,
    generateContent
  };
}
