/**
 * Service class for managing AI Sales Assistant configurations
 * Provides org-wide persistence using Custom Objects instead of localStorage
 */
public with sharing class AISalesAssistantConfigService {
    
    private static final String DEFAULT_CONFIG_TYPE = 'Default';
    private static final String CUSTOM_CONFIG_TYPE = 'Custom';
    
    /**
     * Retrieves the current configuration from the Custom Object
     * Falls back to default if no configuration exists
     */
    @AuraEnabled(cacheable=false)
    public static ConfigWrapper getCurrentConfig() {
        try {
            // First try to get a custom configuration
            List<AI_Sales_Assistant_Config__c> configs = [
                SELECT Id, Config_Type__c, Content_JSON__c, CreatedDate, LastModifiedDate
                FROM AI_Sales_Assistant_Config__c 
                WHERE Config_Type__c = :CUSTOM_CONFIG_TYPE
                ORDER BY LastModifiedDate DESC 
                LIMIT 1
            ];
            
            if (!configs.isEmpty()) {
                AI_Sales_Assistant_Config__c config = configs[0];
                String contentJson = config.Content_JSON__c;
                
                if (String.isNotBlank(contentJson)) {
                    Map<String, Object> contentData = (Map<String, Object>) JSON.deserializeUntyped(contentJson);
                    
                    return new ConfigWrapper(
                        config.Id,
                        config.Config_Type__c,
                        contentData,
                        config.CreatedDate,
                        config.LastModifiedDate,
                        true
                    );
                }
            }
            
            // No custom config found, return indicator for default content
            return new ConfigWrapper(
                null,
                DEFAULT_CONFIG_TYPE,
                new Map<String, Object>(),
                null,
                null,
                false
            );
            
        } catch (Exception e) {
            System.debug('Error retrieving config: ' + e.getMessage());
            throw new AuraHandledException('Failed to retrieve configuration: ' + e.getMessage());
        }
    }
    
    /**
     * Saves AI-generated content to the Custom Object
     * Creates or updates the configuration
     */
    @AuraEnabled
    public static String saveAIContent(String contentJson) {
        try {
            if (String.isBlank(contentJson)) {
                throw new AuraHandledException('Content cannot be empty');
            }
            
            // Validate JSON structure
            Map<String, Object> contentData = (Map<String, Object>) JSON.deserializeUntyped(contentJson);
            validateContentStructure(contentData);
            
            // Check if a custom config already exists
            List<AI_Sales_Assistant_Config__c> existingConfigs = [
                SELECT Id 
                FROM AI_Sales_Assistant_Config__c 
                WHERE Config_Type__c = :CUSTOM_CONFIG_TYPE
                LIMIT 1
            ];
            
            AI_Sales_Assistant_Config__c config;
            
            if (!existingConfigs.isEmpty()) {
                // Update existing configuration
                config = existingConfigs[0];
                config.Content_JSON__c = contentJson;
            } else {
                // Create new configuration
                config = new AI_Sales_Assistant_Config__c(
                    Config_Type__c = CUSTOM_CONFIG_TYPE,
                    Content_JSON__c = contentJson
                );
            }
            
            upsert config;
            
            System.debug('AI content saved successfully. Config Id: ' + config.Id);
            return config.Id;
            
        } catch (Exception e) {
            System.debug('Error saving AI content: ' + e.getMessage());
            throw new AuraHandledException('Failed to save AI content: ' + e.getMessage());
        }
    }
    
    /**
     * Updates specific content item inline
     * For inline editing functionality
     */
    @AuraEnabled
    public static Boolean updateContentItem(String section, Integer itemIndex, String field, String value) {
        try {
            ConfigWrapper currentConfig = getCurrentConfig();
            
            if (!currentConfig.hasCustomContent) {
                throw new AuraHandledException('No custom configuration to update');
            }
            
            Map<String, Object> contentData = currentConfig.contentData;
            
            // Navigate to the specific item
            List<Object> sectionItems = (List<Object>) contentData.get(section);
            if (sectionItems == null || itemIndex >= sectionItems.size()) {
                throw new AuraHandledException('Invalid section or item index');
            }
            
            Map<String, Object> item = (Map<String, Object>) sectionItems[itemIndex];
            item.put(field, value);
            
            // Save the updated content
            String updatedJson = JSON.serialize(contentData);
            saveAIContent(updatedJson);
            
            return true;
            
        } catch (Exception e) {
            System.debug('Error updating content item: ' + e.getMessage());
            throw new AuraHandledException('Failed to update content: ' + e.getMessage());
        }
    }
    
    /**
     * Resets configuration back to defaults
     */
    @AuraEnabled
    public static Boolean resetToDefaults() {
        try {
            List<AI_Sales_Assistant_Config__c> configsToDelete = [
                SELECT Id 
                FROM AI_Sales_Assistant_Config__c 
                WHERE Config_Type__c = :CUSTOM_CONFIG_TYPE
            ];
            
            if (!configsToDelete.isEmpty()) {
                delete configsToDelete;
                System.debug('Custom configurations reset to defaults');
            }
            
            return true;
            
        } catch (Exception e) {
            System.debug('Error resetting to defaults: ' + e.getMessage());
            throw new AuraHandledException('Failed to reset configuration: ' + e.getMessage());
        }
    }
    
    /**
     * Validates that the content JSON has the required structure
     */
    private static void validateContentStructure(Map<String, Object> contentData) {
        List<String> requiredSections = new List<String>{'noTouch', 'lowTouch', 'highTouch'};
        
        for (String section : requiredSections) {
            if (!contentData.containsKey(section)) {
                throw new AuraHandledException('Missing required section: ' + section);
            }
            
            Object sectionData = contentData.get(section);
            if (!(sectionData instanceof List<Object>)) {
                throw new AuraHandledException('Invalid structure for section: ' + section);
            }
        }
    }
    
    /**
     * Wrapper class for configuration data
     */
    public class ConfigWrapper {
        @AuraEnabled public String configId;
        @AuraEnabled public String configType;
        @AuraEnabled public Map<String, Object> contentData;
        @AuraEnabled public DateTime createdDate;
        @AuraEnabled public DateTime lastModifiedDate;
        @AuraEnabled public Boolean hasCustomContent;
        
        public ConfigWrapper(String configId, String configType, Map<String, Object> contentData, 
                           DateTime createdDate, DateTime lastModifiedDate, Boolean hasCustomContent) {
            this.configId = configId;
            this.configType = configType;
            this.contentData = contentData;
            this.createdDate = createdDate;
            this.lastModifiedDate = lastModifiedDate;
            this.hasCustomContent = hasCustomContent;
        }
    }
} 