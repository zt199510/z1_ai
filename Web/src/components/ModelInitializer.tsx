import React, { useEffect } from 'react';
import useModelListStore from '@/stores/modelList';
import getModels, { getCurrentUserModels } from '@/apis/Model';

const ModelInitializer: React.FC = () => {
  const { 
    setModelList, 
    setCurrentModel, 
    initAllProviderList,
    allProviderList
  } = useModelListStore();

  useEffect(() => {
    const initializeModels = async () => {
      try {
        // Get all available models
        const modelsResponse = await getCurrentUserModels();
        if (modelsResponse && Array.isArray(modelsResponse)) {
          setModelList(modelsResponse);
          
          // Set the first model as the current model if it has a valid provider
          const defaultModel = modelsResponse.find(model => model.provider && model.selected);
          if (defaultModel) {
            setCurrentModel(defaultModel);
          }
        }
      } catch (error) {
        console.error('Failed to initialize models:', error);
      }
    };

    // Initialize providers if not already done
    const initializeProviders = async () => {
      if (allProviderList.length === 0) {
        try {
          // This is a placeholder - you'll need to replace with your actual API call
          // to get providers or create a mock list
          const providers = [
            { id: 'default', providerName: 'Default Provider', providerLogo: '' }
          ];
          await initAllProviderList(providers);
        } catch (error) {
          console.error('Failed to initialize providers:', error);
        }
      }
    };

    initializeProviders();
    initializeModels();
  }, [setModelList, setCurrentModel, initAllProviderList, allProviderList]);

  // This component doesn't render anything
  return null;
};

export default ModelInitializer; 