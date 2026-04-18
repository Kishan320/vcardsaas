<template>
  <div class="vcard-preview">
    <component 
      :is="currentTemplateComponent" 
      :data="data"
      :template="template"
      :business-type="businessType"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { getSectionOrder } from '@/utils/sectionHelpers';
import { businessTypeOptions } from '../business-templates';

// Import all template components
import FreelancerTemplate from './templates/FreelancerTemplate.vue';
import DoctorTemplate from './templates/DoctorTemplate.vue';
import RestaurantTemplate from './templates/RestaurantTemplate.vue';
import RealEstateTemplate from './templates/RealEstateTemplate.vue';
import FitnessTemplate from './templates/FitnessTemplate.vue';
import PhotographyTemplate from './templates/PhotographyTemplate.vue';
import LawFirmTemplate from './templates/LawFirmTemplate.vue';
import CafeTemplate from './templates/CafeTemplate.vue';
import SalonTemplate from './templates/SalonTemplate.vue';
import ConstructionTemplate from './templates/ConstructionTemplate.vue';
import EventPlannerTemplate from './templates/EventPlannerTemplate.vue';
import EcommerceTemplate from './templates/EcommerceTemplate.vue';
import TravelTemplate from './templates/TravelTemplate.vue';
import GymTemplate from './templates/GymTemplate.vue';
import BakeryTemplate from './templates/BakeryTemplate.vue';
import FitnessStudioTemplate from './templates/FitnessStudioTemplate.vue';
import TechStartupTemplate from './templates/TechStartupTemplate.vue';
import MusicArtistTemplate from './templates/MusicArtistTemplate.vue';
import WeddingPlannerTemplate from './templates/WeddingPlannerTemplate.vue';
import PetCareTemplate from './templates/PetCareTemplate.vue';
import DigitalMarketingTemplate from './templates/DigitalMarketingTemplate.vue';
import AutomotiveTemplate from './templates/AutomotiveTemplate.vue';
import BeautyCosmeticsTemplate from './templates/BeautyCosmeticsTemplate.vue';
import FoodDeliveryTemplate from './templates/FoodDeliveryTemplate.vue';
import HomeServicesTemplate from './templates/HomeServicesTemplate.vue';
import PersonalTrainerTemplate from './templates/PersonalTrainerTemplate.vue';
import ConsultingTemplate from './templates/ConsultingTemplate.vue';
import GraphicDesignTemplate from './templates/GraphicDesignTemplate.vue';
import YogaWellnessTemplate from './templates/YogaWellnessTemplate.vue';
import PodcastCreatorTemplate from './templates/PodcastCreatorTemplate.vue';
import GamingStreamerTemplate from './templates/GamingStreamerTemplate.vue';
import LifeCoachTemplate from './templates/LifeCoachTemplate.vue';
import VeterinarianTemplate from './templates/VeterinarianTemplate.vue';
import ArchitectDesignerTemplate from './templates/ArchitectDesignerTemplate.vue';

interface VCardPreviewProps {
  businessType: string;
  data: any;
  template: any;
}

const props = defineProps<VCardPreviewProps>();

// Map of business types to their template components
const templateComponents: Record<string, any> = {
  'freelancer': FreelancerTemplate,
  'doctor': DoctorTemplate,
  'restaurant': RestaurantTemplate,
  'real-estate': RealEstateTemplate,
  'fitness': FitnessTemplate,
  'photography': PhotographyTemplate,
  'law-firm': LawFirmTemplate,
  'cafe': CafeTemplate,
  'salon': SalonTemplate,
  'construction': ConstructionTemplate,
  'event-planner': EventPlannerTemplate,
  'ecommerce': EcommerceTemplate,
  'travel': TravelTemplate,
  'gym': GymTemplate,
  'bakery': BakeryTemplate,
  'fitness-studio': FitnessStudioTemplate,
  'tech-startup': TechStartupTemplate,
  'music-artist': MusicArtistTemplate,
  'wedding-planner': WeddingPlannerTemplate,
  'pet-care': PetCareTemplate,
  'digital-marketing': DigitalMarketingTemplate,
  'automotive': AutomotiveTemplate,
  'beauty-cosmetics': BeautyCosmeticsTemplate,
  'food-delivery': FoodDeliveryTemplate,
  'home-services': HomeServicesTemplate,
  'personal-trainer': PersonalTrainerTemplate,
  'consulting': ConsultingTemplate,
  'graphic-design': GraphicDesignTemplate,
  'yoga-wellness': YogaWellnessTemplate,
  'podcast-creator': PodcastCreatorTemplate,
  'gaming-streamer': GamingStreamerTemplate,
  'life-coach': LifeCoachTemplate,
  'veterinarian': VeterinarianTemplate,
  'architect-designer': ArchitectDesignerTemplate,
};

const currentTemplateComponent = computed(() => {
  return templateComponents[props.businessType] || FreelancerTemplate;
});
</script>

<style scoped>
.vcard-preview {
  width: 100%;
  height: 100%;
  min-height: 600px;
}
</style>
