import { watch, onMounted } from 'vue';
import { useBrand } from '@/contexts/BrandContext';

export function useFavicon() {
  const { favicon } = useBrand();

  const updateFavicon = () => {
    if (!favicon.value) return;

    // Convert relative path to full URL if needed
    const faviconUrl = favicon.value.startsWith('http') ? favicon.value : 
                      favicon.value.startsWith('/storage/') ? `${(window as any).appSettings.baseUrl}${favicon.value}` :
                      favicon.value.startsWith('/') ? `${(window as any).appSettings.baseUrl}${favicon.value}` : favicon.value;

    // Update favicon in document head
    let link = document.querySelector("link[rel*='icon']") as HTMLLinkElement;
    
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
    }
    
    link.href = faviconUrl;
  };

  onMounted(() => {
    updateFavicon();
  });

  watch(favicon, () => {
    updateFavicon();
  });
}
