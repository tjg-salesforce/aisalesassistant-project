@isTest
public class AIContentGeneratorServiceTest {
    
    @isTest
    static void testGenerateAIContent_Manufacturing() {
        // Test manufacturing context
        Test.startTest();
        
        String manufacturingContext = 'Manufacturing company focused on automotive parts production with 5 production lines';
        String componentContext = 'Demonstrate AI efficiency for sales teams';
        String result = AIContentGeneratorService.generateAIContent(manufacturingContext, componentContext);
        
        Test.stopTest();
        
        // Verify the result is valid JSON
        System.assertNotEquals(null, result);
        System.assertNotEquals('', result);
        
        // Parse the JSON to verify structure
        Object parsedResult = JSON.deserializeUntyped(result);
        System.assertNotEquals(null, parsedResult);
        
        Map<String, Object> contentMap = (Map<String, Object>) parsedResult;
        System.assert(contentMap.containsKey('noTouch'));
        System.assert(contentMap.containsKey('lowTouch'));
        System.assert(contentMap.containsKey('highTouch'));
        System.assert(contentMap.containsKey('siteVisits'));
    }
    
    @isTest
    static void testGenerateAIContent_Retail() {
        // Test retail context
        Test.startTest();
        
        String retailContext = 'Retail chain with 50+ stores specializing in home goods and furniture';
        String componentContext = 'Demonstrate AI efficiency for sales teams';
        String result = AIContentGeneratorService.generateAIContent(retailContext, componentContext);
        
        Test.stopTest();
        
        // Verify the result is valid JSON
        System.assertNotEquals(null, result);
        System.assertNotEquals('', result);
        
        // Parse the JSON to verify structure
        Object parsedResult = JSON.deserializeUntyped(result);
        Map<String, Object> contentMap = (Map<String, Object>) parsedResult;
        
        // Verify all sections exist
        System.assert(contentMap.containsKey('noTouch'));
        System.assert(contentMap.containsKey('lowTouch'));
        System.assert(contentMap.containsKey('highTouch'));
        System.assert(contentMap.containsKey('siteVisits'));
        
        // Verify noTouch section has content
        List<Object> noTouchItems = (List<Object>) contentMap.get('noTouch');
        System.assert(noTouchItems.size() > 0);
    }
    
    @isTest
    static void testGenerateAIContent_Healthcare() {
        // Test healthcare context
        Test.startTest();
        
        String healthcareContext = 'Healthcare system with multiple hospital locations and medical technology focus';
        String componentContext = 'Demonstrate AI efficiency for sales teams';
        String result = AIContentGeneratorService.generateAIContent(healthcareContext, componentContext);
        
        Test.stopTest();
        
        // Verify the result
        System.assertNotEquals(null, result);
        Object parsedResult = JSON.deserializeUntyped(result);
        Map<String, Object> contentMap = (Map<String, Object>) parsedResult;
        
        System.assert(contentMap.containsKey('noTouch'));
        System.assert(contentMap.containsKey('lowTouch'));
        System.assert(contentMap.containsKey('highTouch'));
        System.assert(contentMap.containsKey('siteVisits'));
    }
    
    @isTest
    static void testGenerateAIContent_Technology() {
        // Test technology context
        Test.startTest();
        
        String techContext = 'Technology company providing cloud infrastructure and software solutions';
        String componentContext = 'Demonstrate AI efficiency for sales teams';
        String result = AIContentGeneratorService.generateAIContent(techContext, componentContext);
        
        Test.stopTest();
        
        // Verify the result
        System.assertNotEquals(null, result);
        Object parsedResult = JSON.deserializeUntyped(result);
        Map<String, Object> contentMap = (Map<String, Object>) parsedResult;
        
        System.assert(contentMap.containsKey('noTouch'));
        System.assert(contentMap.containsKey('lowTouch'));
        System.assert(contentMap.containsKey('highTouch'));
        System.assert(contentMap.containsKey('siteVisits'));
    }
    
    @isTest
    static void testGenerateAIContent_GeneralBusiness() {
        // Test general business context (fallback)
        Test.startTest();
        
        String generalContext = 'General consulting business focusing on strategic planning and operations';
        String componentContext = 'Demonstrate AI efficiency for sales teams';
        String result = AIContentGeneratorService.generateAIContent(generalContext, componentContext);
        
        Test.stopTest();
        
        // Verify the result
        System.assertNotEquals(null, result);
        Object parsedResult = JSON.deserializeUntyped(result);
        Map<String, Object> contentMap = (Map<String, Object>) parsedResult;
        
        System.assert(contentMap.containsKey('noTouch'));
        System.assert(contentMap.containsKey('lowTouch'));
        System.assert(contentMap.containsKey('highTouch'));
        System.assert(contentMap.containsKey('siteVisits'));
    }
    
    @isTest
    static void testGenerateAIContent_EmptyContext() {
        // Test with empty context
        Test.startTest();
        
        String emptyContext = '';
        String componentContext = 'Demonstrate AI efficiency for sales teams';
        String result = AIContentGeneratorService.generateAIContent(emptyContext, componentContext);
        
        Test.stopTest();
        
        // Should still return valid content (general business fallback)
        System.assertNotEquals(null, result);
        Object parsedResult = JSON.deserializeUntyped(result);
        Map<String, Object> contentMap = (Map<String, Object>) parsedResult;
        
        System.assert(contentMap.containsKey('noTouch'));
        System.assert(contentMap.containsKey('lowTouch'));
        System.assert(contentMap.containsKey('highTouch'));
        System.assert(contentMap.containsKey('siteVisits'));
    }
} 