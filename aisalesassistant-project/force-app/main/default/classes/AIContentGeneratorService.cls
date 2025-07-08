public class AIContentGeneratorService {
    
    @AuraEnabled
    public static String generateAIContent(String customerContext, String componentContext) {
        try {
            System.debug('🚀 Starting AI content generation...');
            System.debug('📝 Customer Context: ' + customerContext);
            
            // Build the improved prompt
            String prompt = buildContentGenerationPrompt(customerContext, componentContext);
            System.debug('🔧 Generated Prompt Length: ' + prompt.length());
            
            // Make API call to Gemini
            System.debug('🌐 Calling Gemini API...');
            String aiResponse = callGeminiAPI(prompt);
            
            // If API call returned null (fallback triggered), use contextual content
            if (String.isBlank(aiResponse)) {
                System.debug('🔄 API returned null, using fallback content');
                return generateFallbackContent(customerContext);
            }
            
            System.debug('✅ API Response Length: ' + aiResponse.length());
            
            // Parse and structure the response
            String structuredContent = parseGeminiResponse(aiResponse, customerContext);
            System.debug('📊 Final Content Generated: ' + structuredContent);
            
            return structuredContent;
            
        } catch (Exception e) {
            System.debug('❌ Error generating AI content: ' + e.getMessage());
            System.debug('🔍 Stack Trace: ' + e.getStackTraceString());
            throw new AuraHandledException('Failed to generate AI content: ' + e.getMessage());
        }
    }
    
    private static String buildContentGenerationPrompt(String customerContext, String componentContext) {
        String prompt = 'You are an expert sales assistant AI with deep industry knowledge. Analyze the context and create relevant tasks.\n\n';
        
        prompt += 'INTELLIGENT CONTEXT ANALYSIS for: ' + customerContext + '\n';
        prompt += 'First, analyze this input to determine:\n';
        prompt += '1. INDUSTRY: Identify the sector (tech, retail, healthcare, manufacturing, financial, automotive, etc.)\n';
        prompt += '2. COMPANY SIZE: Infer scale (Fortune 500, mid-market, startup) from name recognition\n';
        prompt += '3. BUSINESS MODEL: Determine type (B2B, B2C, SaaS, marketplace, services)\n';
        prompt += '4. MARKET POSITION: Consider if they\'re established, growing, or transforming\n\n';
        
        prompt += 'INDUSTRY-SPECIFIC CONTEXT:\n';
        prompt += '- Tech companies: Focus on cloud migration, scalability, DevOps, security, AI/ML\n';
        prompt += '- Retail: E-commerce platforms, customer analytics, supply chain, omnichannel\n';
        prompt += '- Healthcare: HIPAA compliance, EHR integration, patient data, telemedicine\n';
        prompt += '- Manufacturing: IoT sensors, automation, supply chain, predictive maintenance\n';
        prompt += '- Financial: Regulatory compliance, fraud detection, real-time processing, security\n';
        prompt += '- Automotive: Connected vehicles, manufacturing automation, supply chain\n\n';
        
        prompt += 'CRITICAL REQUIREMENTS:\n';
        prompt += '- MUST include exactly 3 items in each category: noTouch, lowTouch, highTouch, siteVisits\n';
        prompt += '- ALL titles must be specific to the context (NO "AI Sales Assistant" prefix)\n';
        prompt += '- ALL content must reference industry-specific technologies, competitors, and challenges\n';
        prompt += '- Include realistic dollar amounts and metrics appropriate for the industry and company size\n';
        prompt += '- detailContent should be concise HTML (3-4 key points max) with essential business metrics\n';
        prompt += '- Use formatting: <h3>, <p>, <strong>, <ul>, <li> but keep content focused and brief\n\n';
        
        prompt += 'CATEGORY DEFINITIONS:\n';
        prompt += 'noTouch: Bulk actions AI completed automatically across multiple accounts (portfolio analysis, automated outreach campaigns, batch processing)\n';
        prompt += 'lowTouch: Bulk AI insights ready for one-click approval/review across multiple accounts (campaign approvals, bulk quote reviews, portfolio segmentation)\n';
        prompt += 'highTouch: Critical manual activities requiring focused attention (strategic meetings, important calls, executive decisions)\n';
        prompt += 'siteVisits: Physical visits or in-person meetings that require travel\n\n';
        
        prompt += 'EXAMPLE for "AWS enterprise cloud sales to Fortune 500 companies":\n';
        prompt += '{"noTouch":[';
        prompt += '{"title":"Portfolio Cost Optimization Analysis","description":"AI analyzed 25 enterprise accounts and identified $2.1M in potential S3 and EC2 savings across portfolio","icon":"utility:success","buttonLabel":"View Analysis","buttonLink":"#","detailTitle":"Portfolio Analysis Complete","detailContent":"<h3>Portfolio Analysis Results</h3><p><strong>Accounts Analyzed:</strong> 25 enterprise customers</p><p><strong>Total Savings:</strong> $2.1M annually (24% reduction)</p><ul><li><strong>S3 Optimization:</strong> $800K savings</li><li><strong>EC2 Reserved Instances:</strong> $900K savings</li><li><strong>RDS Rightsizing:</strong> $400K savings</li></ul><p><strong>Timeline:</strong> 90 days implementation</p>"},';
        prompt += '{"title":"Automated Renewal Campaign Results","description":"AI executed outreach to 50+ accounts with contracts expiring in Q4, scheduled 18 meetings automatically","icon":"utility:analytics","buttonLabel":"View Results","buttonLink":"#","detailTitle":"Bulk Outreach Campaign","detailContent":"<h3>Q4 Renewal Campaign</h3><p><strong>Accounts Targeted:</strong> 52 accounts ($28M value)</p><p><strong>Response Rate:</strong> 67% (35 responses)</p><ul><li><strong>Meetings Scheduled:</strong> 18 renewal discussions</li><li><strong>Urgent Actions:</strong> 8 contracts need attention</li></ul>"},';
        prompt += '{"title":"Competitive Intelligence Batch Processing","description":"AI analyzed 30+ Azure customers and prepared migration strategies for bulk outreach campaign","icon":"utility:email","buttonLabel":"View Intel","buttonLink":"#","detailTitle":"Competitive Analysis Complete","detailContent":"<h3>🔍 Azure Competitive Analysis</h3><div style=\\"background: #fff2e5; padding: 12px; border-radius: 6px; margin-bottom: 15px;\\"><p><strong>🎯 Analysis Scope:</strong> 32 Azure customers identified for migration</p><p><strong>💰 Revenue Opportunity:</strong> <span style=\\"color: #d96c0a;\\">$45M total potential</span></p></div><h4>🔥 Key Competitive Advantages:</h4><ul><li><strong>💸 Cost Overruns:</strong> Azure customers experiencing 25-40% budget overages</li><li><strong>⚡ Performance Issues:</strong> Slower provisioning and scaling vs AWS</li><li><strong>🧩 Complexity:</strong> Management overhead 30% higher than AWS</li></ul><hr/><h4>📋 Campaign Assets Created:</h4><p>✅ 32 account-specific battle cards<br/>✅ Personalized ROI calculators<br/>✅ Migration timeline templates<br/>✅ Competitive positioning decks</p><p><a href=\\"#\\" style=\\"color: #d96c0a;\\">🚀 Launch migration outreach campaign →</a></p>"}],';
        prompt += '"lowTouch":[';
        prompt += '{"title":"Q1 Enterprise Campaign Approval","description":"AI segmented 150 prospects and prepared multi-touch campaign ready for one-click deployment","icon":"utility:approval","buttonLabel":"Approve Campaign","buttonLink":"#","detailTitle":"Campaign Ready for Approval","detailContent":"<h3>🚀 Q1 Enterprise Campaign</h3><div style=\\"background: #e8f4fd; padding: 12px; border-radius: 6px; margin-bottom: 15px;\\"><p><strong>🎯 Target Universe:</strong> 150 enterprise prospects</p><p><strong>💰 Pipeline Potential:</strong> <span style=\\"color: #0176d3;\\">$75M total opportunity</span></p></div><h4>📊 Campaign Segmentation:</h4><ul><li><strong>Tier 1:</strong> Fortune 500 companies (50 accounts, avg $800K)</li><li><strong>Tier 2:</strong> Mid-market leaders (75 accounts, avg $400K)</li><li><strong>Tier 3:</strong> Growth companies (25 accounts, avg $200K)</li></ul><hr/><h4>📦 Ready-to-Deploy Assets:</h4><p>✅ Personalized email sequences (6 touches each)<br/>✅ Interactive ROI calculators<br/>✅ Industry-specific case studies<br/>✅ Competitive comparison guides</p><p><strong>📅 Deployment Schedule:</strong> 6-week staged rollout</p><p><a href=\\"#\\" style=\\"color: #0176d3;\\">✅ Approve and launch campaign →</a></p>"},';
        prompt += '{"title":"Bulk Quote Review for Portfolio","description":"AI analyzed 28 pending quotes across portfolio and flagged 8 requiring pricing adjustments","icon":"utility:knowledge_base","buttonLabel":"Review Quotes","buttonLink":"#","detailTitle":"Portfolio Quote Analysis","detailContent":"<h3>📋 Portfolio Quote Review</h3><div style=\\"background: #f0f9ff; padding: 12px; border-radius: 6px; margin-bottom: 15px;\\"><p><strong>📊 Analysis Summary:</strong> 28 proposals worth $12.5M total value</p></div><h4>✅ Approval Status:</h4><ul style=\\"margin-bottom: 15px;\\"><li><strong style=\\"color: #1a9640;\\">Ready to Send:</strong> 20 quotes (78% win probability)</li><li><strong style=\\"color: #d96c0a;\\">Needs Review:</strong> 8 quotes requiring pricing adjustments</li></ul><hr/><h4>⚡ Priority Actions:</h4><ol><li><strong>Expedite Review:</strong> 5 quotes with urgent timelines</li><li><strong>Competitive Pricing:</strong> 3 quotes facing pricing pressure</li><li><strong>Technical Review:</strong> 2 quotes need solution validation</li></ol><p><a href=\\"#\\" style=\\"color: #0176d3;\\">📝 Review flagged quotes →</a> | <a href=\\"#\\" style=\\"color: #1a9640;\\">✅ Approve ready quotes →</a></p>"},';
        prompt += '{"title":"Portfolio Risk Assessment Approval","description":"AI identified 15 at-risk accounts and prepared retention strategies for bulk implementation","icon":"utility:warning","buttonLabel":"Review Strategies","buttonLink":"#","detailTitle":"Portfolio Risk Analysis","detailContent":"<h3>⚠️ At-Risk Account Analysis</h3><div style=\\"background: #fef7f0; padding: 12px; border-radius: 6px; margin-bottom: 15px;\\"><p><strong>🎯 Accounts at Risk:</strong> 15 customers</p><p><strong>💰 Revenue Impact:</strong> <span style=\\"color: #d96c0a;\\">$22M annual value</span></p></div><h4>🔍 Risk Factors Identified:</h4><ul><li><strong>📅 Contract Expirations:</strong> 8 accounts (next 90 days)</li><li><strong>🏢 Competitive Threats:</strong> 4 accounts with active competitor engagement</li><li><strong>💸 Budget Constraints:</strong> 3 accounts facing cost reduction pressure</li></ul><hr/><h4>📈 Retention Strategies:</h4><p><strong>High-Touch Accounts (8):</strong> Executive engagement + custom ROI analysis<br/><strong>Standard Accounts (5):</strong> Account manager outreach + value demonstration<br/><strong>Cost-Sensitive (2):</strong> Pricing review + contract restructuring</p><p><strong>🎯 Historical Success Rate:</strong> 85% retention with proactive intervention</p><p><a href=\\"#\\" style=\\"color: #d96c0a;\\">🚀 Launch retention campaigns →</a></p>"}],';
        prompt += '"highTouch":[';
        prompt += '{"title":"TechCorp CTO Strategic Meeting","description":"Critical $5M cloud transformation discussion with TechCorp leadership team","icon":"utility:people","buttonLabel":"Prepare Meeting","buttonLink":"#","detailTitle":"Executive Engagement Required","detailContent":"<h3>🎯 Strategic Account Meeting</h3><div style=\\"background: #f3e8ff; padding: 12px; border-radius: 6px; margin-bottom: 15px;\\"><p><strong>🏢 Account:</strong> TechCorp - Fortune 100 technology company</p><p><strong>💰 Opportunity Size:</strong> <span style=\\"color: #8b5cf6;\\">$5M initial, $25M multi-year potential</span></p></div><h4>👥 Key Stakeholders:</h4><ul><li><strong>CTO:</strong> Cloud strategy decision maker</li><li><strong>VP Engineering:</strong> Technical implementation lead</li><li><strong>Chief Digital Officer:</strong> Transformation champion</li></ul><hr/><h4>📋 Meeting Objectives:</h4><p><strong>Primary Goal:</strong> AWS cloud-first strategy alignment<br/><strong>Key Topics:</strong> Security compliance, migration timeline, cost optimization<br/><strong>Success Metric:</strong> Commitment to AWS as preferred cloud provider</p><div style=\\"background: #fef3e2; padding: 10px; border-radius: 4px; margin-top: 10px;\\"><p>⚠️ <strong>Competitive Alert:</strong> Google Cloud actively pursuing this account</p></div><p><a href=\\"#\\" style=\\"color: #8b5cf6;\\">📊 Access executive presentation materials →</a></p>"},';
        prompt += '{"title":"GlobalBank Risk Assessment Call","description":"Urgent compliance discussion for $3M financial services cloud migration","icon":"utility:shield","buttonLabel":"Schedule Call","buttonLink":"#","detailTitle":"High-Priority Customer Issue","detailContent":"<h3>🛡️ Compliance & Risk Discussion</h3><div style=\\"background: #f0fdf4; padding: 12px; border-radius: 6px; margin-bottom: 15px;\\"><p><strong>🏦 Customer:</strong> GlobalBank - Tier 1 financial institution</p><p><strong>💰 Revenue Impact:</strong> <span style=\\"color: #10b981;\\">$3M immediate, $15M pipeline</span></p></div><h4>⚠️ Critical Issue:</h4><ul><li><strong>📋 Compliance Topic:</strong> Regulatory requirements for cloud migration</li><li><strong>⏰ Timeline:</strong> Must resolve within 2 weeks for project approval</li><li><strong>🎯 Success Factor:</strong> Technical and regulatory alignment</li></ul><hr/><h4>👥 Key Stakeholders:</h4><p><strong>Customer Side:</strong> Chief Risk Officer, Compliance Director<br/><strong>AWS Resources:</strong> Solutions Architect, Security Specialist<br/><strong>Meeting Type:</strong> Technical deep-dive + risk assessment</p><div style=\\"background: #fef3e2; padding: 10px; border-radius: 4px; margin-top: 10px;\\"><p>📈 <strong>Success Impact:</strong> Approval unlocks immediate $3M opportunity + $15M future pipeline</p></div><p><a href=\\"#\\" style=\\"color: #10b981;\\">🔒 Access compliance documentation →</a></p>"},';
        prompt += '{"title":"Healthcare Consortium Proposal Presentation","description":"Executive presentation to 8-hospital consortium for $7M cloud infrastructure modernization","icon":"utility:graph","buttonLabel":"Finalize Deck","buttonLink":"#","detailTitle":"Major Opportunity Presentation","detailContent":"<h3>🏥 Healthcare Consortium Opportunity</h3><div style=\\"background: #fef2f2; padding: 12px; border-radius: 6px; margin-bottom: 15px;\\"><p><strong>🎯 Audience:</strong> 8 hospital CIOs and IT Directors</p><p><strong>💰 Opportunity Value:</strong> <span style=\\"color: #ef4444;\\">$7M infrastructure modernization</span></p></div><h4>🏆 Competitive Landscape:</h4><ul><li><strong>AWS Position:</strong> Healthcare-specific solutions leader</li><li><strong>Competition:</strong> Microsoft Azure, Google Cloud also presenting</li><li><strong>⏰ Decision Timeline:</strong> 30 days from presentation</li></ul><hr/><h4>🔑 Key Differentiators:</h4><ol><li><strong>HIPAA Compliance:</strong> Native healthcare security controls</li><li><strong>Cost Optimization:</strong> 25-30% infrastructure savings projected</li><li><strong>Patient Data Protection:</strong> Advanced encryption and access controls</li><li><strong>Interoperability:</strong> HL7 FHIR support and healthcare APIs</li></ol><div style=\\"background: #f0f9ff; padding: 10px; border-radius: 4px; margin-top: 10px;\\"><p>📊 <strong>Success Factors:</strong> Technical architecture + regulatory compliance + cost justification</p></div><p><a href=\\"#\\" style=\\"color: #ef4444;\\">📋 Finalize presentation deck →</a> | <a href=\\"#\\" style=\\"color: #ef4444;\\">🔒 HIPAA compliance overview →</a></p>"}],';
        prompt += '"siteVisits":[';
        prompt += '{"title":"ManufacturingCorp Factory Visit","description":"On-site assessment of 3 production facilities for IoT sensor deployment strategy","icon":"utility:location","buttonLabel":"Plan Visit","buttonLink":"#","detailTitle":"Customer Site Assessment","detailContent":"<h3>🏭 Manufacturing Site Visit</h3><div style=\\"background: #f8fafc; padding: 12px; border-radius: 6px; margin-bottom: 15px;\\"><p><strong>🏢 Customer:</strong> ManufacturingCorp - Multi-facility operations</p><p><strong>💰 Pipeline Value:</strong> <span style=\\"color: #6b7280;\\">$2.3M IoT implementation</span></p></div><h4>📍 Visit Locations:</h4><ul><li><strong>Detroit Facility:</strong> Primary production line assessment</li><li><strong>Chicago Plant:</strong> Automation systems evaluation</li><li><strong>Atlanta Warehouse:</strong> Distribution IoT opportunities</li></ul><hr/><h4>🎯 Visit Objectives:</h4><p><strong>Primary Purpose:</strong> IoT sensor placement and connectivity assessment<br/><strong>Duration:</strong> 3 days across multiple facilities<br/><strong>Key Deliverable:</strong> Detailed IoT implementation roadmap</p><h4>👥 On-Site Stakeholders:</h4><p>• Plant managers (operational requirements)<br/>• IT directors (technical architecture)<br/>• Operations teams (workflow integration)</p><div style=\\"background: #f0f9ff; padding: 10px; border-radius: 4px; margin-top: 10px;\\"><p>📈 <strong>Follow-up:</strong> Executive presentation for $2.3M proposal approval</p></div><p><a href=\\"#\\" style=\\"color: #6b7280;\\">🗺️ Review facility maps →</a></p>"},';
        prompt += '{"title":"TechCorp Data Center Tour","description":"Executive visit to TechCorp\'s legacy data center for migration planning and relationship building","icon":"utility:company","buttonLabel":"Schedule Tour","buttonLink":"#","detailTitle":"Strategic Relationship Building","detailContent":"<h3>🏢 Data Center Assessment Visit</h3><div style=\\"background: #f3f4f6; padding: 12px; border-radius: 6px; margin-bottom: 15px;\\"><p><strong>🎯 Customer:</strong> TechCorp headquarters, Silicon Valley</p><p><strong>💰 Business Impact:</strong> <span style=\\"color: #6366f1;\\">Foundation for $25M multi-year migration</span></p></div><h4>🎯 Visit Objectives:</h4><ul><li><strong>Infrastructure Assessment:</strong> Current data center capabilities</li><li><strong>Migration Planning:</strong> Phased cloud transition strategy</li><li><strong>Relationship Building:</strong> Executive-level trust development</li></ul><hr/><h4>👥 Key Meetings Scheduled:</h4><p><strong>Executive Level:</strong> CTO strategic alignment<br/><strong>Technical Team:</strong> Infrastructure team deep-dive<br/><strong>Security Focus:</strong> Compliance and security review</p><h4>🏗️ Tour Scope:</h4><p>• Primary data center (Tier 1 operations)<br/>• Backup facility (Disaster recovery)<br/>• Network operations center (NOC)<br/>• Security and compliance facilities</p><div style=\\"background: #eff6ff; padding: 10px; border-radius: 4px; margin-top: 10px;\\"><p>🤝 <strong>Strategic Value:</strong> Executive trust building for long-term strategic partnership</p></div><p><a href=\\"#\\" style=\\"color: #6366f1;\\">📋 Review facility assessment checklist →</a></p>"},';
        prompt += '{"title":"AWS re:Invent Customer Meetups","description":"Strategic in-person meetings with 15 key accounts during AWS conference in Las Vegas","icon":"utility:event","buttonLabel":"Review Schedule","buttonLink":"#","detailTitle":"Conference Networking Strategy","detailContent":"<h3>🎪 re:Invent Customer Engagement</h3><div style=\\"background: #fef3e2; padding: 12px; border-radius: 6px; margin-bottom: 15px;\\"><p><strong>📍 Event:</strong> AWS re:Invent, Las Vegas</p><p><strong>💰 Total Pipeline Value:</strong> <span style=\\"color: #d97706;\\">$45M across all meetings</span></p></div><h4>📅 Meeting Schedule:</h4><ul><li><strong>Day 1:</strong> 5 enterprise customers (exec dinners)</li><li><strong>Day 2:</strong> 6 customers (booth demos + workshops)</li><li><strong>Day 3:</strong> 4 customers (innovation sessions)</li></ul><hr/><h4>🎯 Meeting Types:</h4><p><strong>Executive Dinners:</strong> C-level strategic discussions<br/><strong>Booth Demonstrations:</strong> Technical product showcases<br/><strong>Innovation Workshops:</strong> Future roadmap alignment<br/><strong>Keynote Networking:</strong> Relationship building opportunities</p><h4>🚀 Key Announcements:</h4><p>• New AWS AI/ML services for industry verticals<br/>• Security and compliance updates<br/>• Cost optimization tools and best practices<br/>• Partnership ecosystem developments</p><div style=\\"background: #fef7e0; padding: 10px; border-radius: 4px; margin-top: 10px;\\"><p>📈 <strong>Follow-up Strategy:</strong> Post-conference proposals and pilot program launches</p></div><p><a href=\\"#\\" style=\\"color: #d97706;\\">📋 Review meeting agenda →</a> | <a href=\\"#\\" style=\\"color: #d97706;\\">🎟️ Access VIP events →</a></p>"}]}\n\n';
        
        prompt += 'Now create similar context-specific content for: ' + customerContext + '\n';
        prompt += 'Use the exact JSON format above with all required fields. Make titles specific to the context without AI assistant prefix.\n';
        
        return prompt;
    }
    
    private static String callGeminiAPI(String prompt) {
        if (Test.isRunningTest()) {
            return '{"candidates":[{"content":{"parts":[{"text":"{\\"noTouch\\":[{\\"title\\":\\"Mock Task\\",\\"description\\":\\"Mock Description\\"}]}"}]}}]}';
        }
        
        Http http = new Http();
        HttpRequest request = new HttpRequest();
        
        String apiKey = getGeminiAPIKey();
        request.setEndpoint('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=' + apiKey);
        request.setMethod('POST');
        request.setHeader('Content-Type', 'application/json');
        
        Map<String, Object> requestBody = new Map<String, Object>{
            'contents' => new List<Object>{
                new Map<String, Object>{
                    'parts' => new List<Object>{
                        new Map<String, Object>{
                            'text' => prompt
                        }
                    }
                }
            },
            'generationConfig' => new Map<String, Object>{
                'temperature' => 0.7,
                'topK' => 40,
                'topP' => 0.95,
                'maxOutputTokens' => 3000
            }
        };
        
        request.setBody(JSON.serialize(requestBody));
        request.setTimeout(30000);
        
        HttpResponse response = http.send(request);
        
        if (response.getStatusCode() == 200) {
            return response.getBody();
        } else {
            System.debug('API Error: ' + response.getStatusCode() + ' - ' + response.getBody());
            
            if (response.getStatusCode() == 403) {
                System.debug('403 Forbidden - Using fallback content.');
                return null;
            }
            
            throw new CalloutException('API call failed: ' + response.getStatusCode());
        }
    }
    
    private static String getGeminiAPIKey() {
        try {
            AI_Service_Config__mdt config = [
                SELECT API_Key__c 
                FROM AI_Service_Config__mdt 
                WHERE DeveloperName = 'Gemini_Config' 
                LIMIT 1
            ];
            return config.API_Key__c;
        } catch (Exception e) {
            System.debug('Error retrieving API key: ' + e.getMessage());
            return 'AIzaSyDKcS4ulegp16DR9oO6UApy2W2W2mDwiDM'; // Fallback to provided key
        }
    }
    
    private static String parseGeminiResponse(String aiResponse, String userContext) {
        try {
            System.debug('🤖 Raw Gemini Response: ' + aiResponse);
            
            Map<String, Object> responseMap = (Map<String, Object>) JSON.deserializeUntyped(aiResponse);
            String generatedText = '';
            
            // Navigate Gemini's response structure: candidates[0].content.parts[0].text
            List<Object> candidates = (List<Object>) responseMap.get('candidates');
            if (candidates != null && !candidates.isEmpty()) {
                Map<String, Object> firstCandidate = (Map<String, Object>) candidates[0];
                Map<String, Object> content = (Map<String, Object>) firstCandidate.get('content');
                if (content != null) {
                    List<Object> parts = (List<Object>) content.get('parts');
                    if (parts != null && !parts.isEmpty()) {
                        Map<String, Object> firstPart = (Map<String, Object>) parts[0];
                        generatedText = (String) firstPart.get('text');
                    }
                }
            }
            
            System.debug('📝 Generated Text from Gemini: ' + generatedText);
            
            if (String.isBlank(generatedText)) {
                System.debug('❌ Generated text is blank, using fallback');
                return generateFallbackContent(userContext);
            }
            
            if (!generatedText.contains('{')) {
                System.debug('❌ Generated text contains no JSON, using fallback. Text: ' + generatedText);
                return generateFallbackContent(userContext);
            }
            
            String jsonContent = extractJSONFromText(generatedText);
            System.debug('🔍 Extracted JSON: ' + jsonContent);
            
            if (String.isNotBlank(jsonContent)) {
                try {
                    Object parsedJson = JSON.deserializeUntyped(jsonContent);
                    System.debug('✅ JSON parsed successfully from Gemini');
                    return jsonContent;
                } catch (Exception jsonError) {
                    System.debug('❌ JSON parsing failed: ' + jsonError.getMessage());
                    return generateFallbackContent(userContext);
                }
            }
            
            System.debug('❌ No valid JSON extracted, using fallback');
            return generateFallbackContent(userContext);
            
        } catch (Exception e) {
            System.debug('❌ Error parsing Gemini response: ' + e.getMessage());
            System.debug('🔍 Stack trace: ' + e.getStackTraceString());
            return generateFallbackContent(userContext);
        }
    }
    
    private static String extractJSONFromText(String text) {
        Integer startIndex = text.indexOf('{');
        Integer endIndex = text.lastIndexOf('}');
        
        if (startIndex >= 0 && endIndex > startIndex) {
            return text.substring(startIndex, endIndex + 1);
        }
        
        return null;
    }
    
    private static String generateFallbackContent(String userContext) {
        System.debug('🔄 Generating fallback content for context: ' + userContext);
        String contextLower = userContext.toLowerCase();
        
        Map<String, Object> content = new Map<String, Object>();
        
        // Context-aware fallback content - same logic as your LWC component
        if (contextLower.contains('manufacturing') || contextLower.contains('factory') || contextLower.contains('production')) {
            content = getManufacturingFallback();
        } else if (contextLower.contains('retail') || contextLower.contains('store') || contextLower.contains('customer')) {
            content = getRetailFallback();
        } else if (contextLower.contains('consumer goods') || contextLower.contains('cpg') || contextLower.contains('fmcg')) {
            content = getConsumerGoodsFallback();
        } else if (contextLower.contains('healthcare') || contextLower.contains('hospital') || contextLower.contains('medical')) {
            content = getHealthcareFallback();
        } else if (contextLower.contains('technology') || contextLower.contains('software') || contextLower.contains('IT')) {
            content = getTechnologyFallback();
        } else {
            // Generic business content that works for any industry
            content = getGenericBusinessFallback();
        }
        
        return JSON.serialize(content);
    }
    
    private static Map<String, Object> getManufacturingFallback() {
        return new Map<String, Object>{
            'noTouch' => new List<Object>{
                new Map<String, Object>{
                    'title' => 'Quality Control Analysis',
                    'description' => 'AI analyzed production data and identified 3 quality improvement opportunities',
                    'icon' => 'utility:success',
                    'buttonLabel' => 'View Report',
                    'buttonLink' => '#',
                    'detailTitle' => 'Quality Insights',
                    'detailContent' => '<p>AI analysis of production data has identified potential quality improvements across multiple manufacturing lines.</p>'
                },
                new Map<String, Object>{
                    'title' => 'Predictive Maintenance Alert',
                    'description' => 'Maintenance scheduled for 5 critical machines based on sensor data',
                    'icon' => 'utility:warning',
                    'buttonLabel' => 'View Schedule',
                    'buttonLink' => '#',
                    'detailTitle' => 'Maintenance Planning',
                    'detailContent' => '<p>Predictive analytics indicate potential equipment issues. Preventive maintenance has been scheduled.</p>'
                },
                new Map<String, Object>{
                    'title' => 'Supplier RFQ Automation',
                    'description' => 'AI sent RFQ requests to 23 suppliers for new component requirements',
                    'icon' => 'utility:email',
                    'buttonLabel' => 'View Responses',
                    'buttonLink' => '#',
                    'detailTitle' => 'RFQ Process',
                    'detailContent' => '<p>AI identified qualified suppliers and automatically sent RFQ requests with technical specifications.</p>'
                }
            },
            'lowTouch' => new List<Object>{
                new Map<String, Object>{
                    'title' => 'Supplier Performance Review',
                    'description' => 'Review quarterly metrics for top 15 suppliers',
                    'icon' => 'utility:chart',
                    'buttonLabel' => 'Review Metrics',
                    'buttonLink' => '#',
                    'detailTitle' => 'Supplier Analysis',
                    'detailContent' => '<p>Quarterly supplier performance review identifies top performers and areas for improvement.</p>'
                },
                new Map<String, Object>{
                    'title' => 'Production Schedule Optimization',
                    'description' => 'Approve AI-recommended production schedule adjustments',
                    'icon' => 'utility:approval',
                    'buttonLabel' => 'Review Schedule',
                    'buttonLink' => '#',
                    'detailTitle' => 'Schedule Optimization',
                    'detailContent' => '<p>AI has identified opportunities to optimize production schedules for improved efficiency.</p>'
                }
            },
            'highTouch' => new List<Object>{
                new Map<String, Object>{
                    'title' => 'Strategic Client Meeting',
                    'description' => 'Prepare for meeting with major manufacturing client',
                    'icon' => 'utility:people',
                    'buttonLabel' => 'View Brief',
                    'buttonLink' => '#',
                    'detailTitle' => 'Client Preparation',
                    'detailContent' => '<p>Comprehensive brief for upcoming strategic discussion with key manufacturing partner.</p>'
                },
                new Map<String, Object>{
                    'title' => 'Product Launch Planning',
                    'description' => 'Strategic planning session for Q2 product launch',
                    'icon' => 'utility:strategy',
                    'buttonLabel' => 'View Strategy',
                    'buttonLink' => '#',
                    'detailTitle' => 'Launch Strategy',
                    'detailContent' => '<p>Critical strategic planning required for successful product launch including market positioning.</p>'
                }
            },
            'siteVisits' => new List<Object>{
                new Map<String, Object>{
                    'title' => 'Facility Assessment',
                    'description' => 'On-site operational review and assessment',
                    'icon' => 'utility:location',
                    'buttonLabel' => 'View Details',
                    'buttonLink' => '#',
                    'detailTitle' => 'Facility Visit',
                    'detailContent' => '<p>Comprehensive tour of production facility including quality control stations and automation systems.</p>'
                },
                new Map<String, Object>{
                    'title' => 'Customer Plant Assessment',
                    'description' => 'On-site evaluation of customer manufacturing processes',
                    'icon' => 'utility:location',
                    'buttonLabel' => 'Schedule Visit',
                    'buttonLink' => '#',
                    'detailTitle' => 'Plant Assessment',
                    'detailContent' => '<p>Customer requested assessment of their manufacturing processes for efficiency improvements.</p>'
                }
            }
        };
    }
    
    private static Map<String, Object> getRetailFallback() {
        return new Map<String, Object>{
            'noTouch' => new List<Object>{
                new Map<String, Object>{
                    'title' => 'Customer Analytics Insight',
                    'description' => 'AI identified 5 customer behavior optimization opportunities',
                    'icon' => 'utility:analytics',
                    'buttonLabel' => 'View Insights',
                    'buttonLink' => '#',
                    'detailTitle' => 'Customer Analysis',
                    'detailContent' => '<p>Advanced analytics reveal customer shopping patterns and preferences for improved merchandising.</p>'
                },
                new Map<String, Object>{
                    'title' => 'Inventory Optimization',
                    'description' => 'Automated reordering for 25 SKUs based on demand forecasting',
                    'icon' => 'utility:truck',
                    'buttonLabel' => 'View Orders',
                    'buttonLink' => '#',
                    'detailTitle' => 'Inventory Management',
                    'detailContent' => '<p>AI-driven demand forecasting has optimized inventory levels across all product categories.</p>'
                },
                new Map<String, Object>{
                    'title' => 'Promotional Campaign Results',
                    'description' => 'AI analyzed campaign performance and identified top-performing promotions',
                    'icon' => 'utility:success',
                    'buttonLabel' => 'View Results',
                    'buttonLink' => '#',
                    'detailTitle' => 'Campaign Analysis',
                    'detailContent' => '<p>Promotional campaign analysis reveals highest-performing offers and customer segments.</p>'
                }
            },
            'lowTouch' => new List<Object>{
                new Map<String, Object>{
                    'title' => 'Store Performance Review',
                    'description' => 'Monthly analysis of top-performing store locations',
                    'icon' => 'utility:chart',
                    'buttonLabel' => 'View Report',
                    'buttonLink' => '#',
                    'detailTitle' => 'Store Metrics',
                    'detailContent' => '<p>Comprehensive performance review of retail locations with expansion recommendations.</p>'
                },
                new Map<String, Object>{
                    'title' => 'Category Management Review',
                    'description' => 'Review product category performance and optimization opportunities',
                    'icon' => 'utility:apps',
                    'buttonLabel' => 'Review Categories',
                    'buttonLink' => '#',
                    'detailTitle' => 'Category Analysis',
                    'detailContent' => '<p>Product category analysis identifies optimization opportunities and market trends.</p>'
                }
            },
            'highTouch' => new List<Object>{
                new Map<String, Object>{
                    'title' => 'Regional Expansion Strategy',
                    'description' => 'Strategic planning session for Q4 retail growth',
                    'icon' => 'utility:strategy',
                    'buttonLabel' => 'View Plan',
                    'buttonLink' => '#',
                    'detailTitle' => 'Expansion Planning',
                    'detailContent' => '<p>Critical strategic session to discuss regional expansion plans and market opportunities.</p>'
                },
                new Map<String, Object>{
                    'title' => 'Key Account Management',
                    'description' => 'Strategic review of top 10 retail accounts and growth opportunities',
                    'icon' => 'utility:people',
                    'buttonLabel' => 'View Accounts',
                    'buttonLink' => '#',
                    'detailTitle' => 'Account Strategy',
                    'detailContent' => '<p>Comprehensive review of key retail accounts including growth strategies and partnership opportunities.</p>'
                }
            },
            'siteVisits' => new List<Object>{
                new Map<String, Object>{
                    'title' => 'Flagship Store Tour',
                    'description' => 'New flagship location merchandising and layout review',
                    'icon' => 'utility:location',
                    'buttonLabel' => 'View Schedule',
                    'buttonLink' => '#',
                    'detailTitle' => 'Store Visit',
                    'detailContent' => '<p>Comprehensive review of flagship store including merchandising, customer flow, and technology integration.</p>'
                },
                new Map<String, Object>{
                    'title' => 'Customer Experience Assessment',
                    'description' => 'On-site evaluation of customer journey and experience optimization',
                    'icon' => 'utility:location',
                    'buttonLabel' => 'Schedule Visit',
                    'buttonLink' => '#',
                    'detailTitle' => 'Experience Review',
                    'detailContent' => '<p>Customer experience assessment focusing on journey optimization and satisfaction improvements.</p>'
                }
            }
        };
    }
    
    private static Map<String, Object> getConsumerGoodsFallback() {
        return new Map<String, Object>{
            'noTouch' => new List<Object>{
                new Map<String, Object>{
                    'title' => 'Brand Performance Analysis',
                    'description' => 'AI analyzed brand metrics across 15 product categories',
                    'icon' => 'utility:analytics',
                    'buttonLabel' => 'View Analysis',
                    'buttonLink' => '#',
                    'detailTitle' => 'Brand Insights',
                    'detailContent' => '<p>Comprehensive brand performance analysis reveals market positioning and competitive opportunities.</p>'
                },
                new Map<String, Object>{
                    'title' => 'Supply Chain Optimization',
                    'description' => 'Automated supply chain adjustments reduced costs by 12%',
                    'icon' => 'utility:success',
                    'buttonLabel' => 'View Savings',
                    'buttonLink' => '#',
                    'detailTitle' => 'Supply Chain',
                    'detailContent' => '<p>Supply chain optimization through AI-driven demand planning and inventory management.</p>'
                },
                new Map<String, Object>{
                    'title' => 'Market Share Tracking',
                    'description' => 'Real-time market share analysis across key retail channels',
                    'icon' => 'utility:chart',
                    'buttonLabel' => 'View Trends',
                    'buttonLink' => '#',
                    'detailTitle' => 'Market Analysis',
                    'detailContent' => '<p>Market share tracking reveals competitive position and growth opportunities in key channels.</p>'
                }
            },
            'lowTouch' => new List<Object>{
                new Map<String, Object>{
                    'title' => 'Product Portfolio Review',
                    'description' => 'Quarterly review of product performance and lifecycle management',
                    'icon' => 'utility:product',
                    'buttonLabel' => 'Review Portfolio',
                    'buttonLink' => '#',
                    'detailTitle' => 'Portfolio Analysis',
                    'detailContent' => '<p>Product portfolio analysis identifies optimization opportunities and innovation pipeline priorities.</p>'
                },
                new Map<String, Object>{
                    'title' => 'Trade Promotion Effectiveness',
                    'description' => 'Analyze ROI of trade promotions across retail partners',
                    'icon' => 'utility:money',
                    'buttonLabel' => 'View ROI',
                    'buttonLink' => '#',
                    'detailTitle' => 'Promotion Analysis',
                    'detailContent' => '<p>Trade promotion analysis reveals most effective promotional strategies and partner performance.</p>'
                }
            },
            'highTouch' => new List<Object>{
                new Map<String, Object>{
                    'title' => 'Innovation Pipeline Review',
                    'description' => 'Strategic review of new product development and launch planning',
                    'icon' => 'utility:strategy',
                    'buttonLabel' => 'View Pipeline',
                    'buttonLink' => '#',
                    'detailTitle' => 'Innovation Strategy',
                    'detailContent' => '<p>Innovation pipeline review including market research, development timelines, and launch strategies.</p>'
                },
                new Map<String, Object>{
                    'title' => 'Retailer Partnership Strategy',
                    'description' => 'Strategic planning for key retailer relationships and category growth',
                    'icon' => 'utility:people',
                    'buttonLabel' => 'View Strategy',
                    'buttonLink' => '#',
                    'detailTitle' => 'Partnership Planning',
                    'detailContent' => '<p>Strategic retailer partnership planning focusing on category growth and mutual value creation.</p>'
                }
            },
            'siteVisits' => new List<Object>{
                new Map<String, Object>{
                    'title' => 'Manufacturing Facility Tour',
                    'description' => 'New production line capability assessment and quality review',
                    'icon' => 'utility:location',
                    'buttonLabel' => 'View Details',
                    'buttonLink' => '#',
                    'detailTitle' => 'Facility Assessment',
                    'detailContent' => '<p>Manufacturing facility tour including production capabilities, quality systems, and capacity planning.</p>'
                },
                new Map<String, Object>{
                    'title' => 'Retail Partner Visit',
                    'description' => 'Strategic visit to key retail partner for category review',
                    'icon' => 'utility:location',
                    'buttonLabel' => 'Schedule Visit',
                    'buttonLink' => '#',
                    'detailTitle' => 'Partner Meeting',
                    'detailContent' => '<p>Strategic retail partner visit for category performance review and growth planning.</p>'
                }
            }
        };
    }
    
    private static Map<String, Object> getGenericBusinessFallback() {
        return new Map<String, Object>{
            'noTouch' => new List<Object>{
                new Map<String, Object>{
                    'title' => 'Business Intelligence Report',
                    'description' => 'AI-generated insights from quarterly business performance data',
                    'icon' => 'utility:analytics',
                    'buttonLabel' => 'View Report',
                    'buttonLink' => '#',
                    'detailTitle' => 'Business Intelligence',
                    'detailContent' => '<p>AI-powered analysis of business metrics reveals key trends and growth opportunities.</p>'
                },
                new Map<String, Object>{
                    'title' => 'Process Optimization Alert',
                    'description' => 'Automated analysis identified 8 operational improvement opportunities',
                    'icon' => 'utility:success',
                    'buttonLabel' => 'View Opportunities',
                    'buttonLink' => '#',
                    'detailTitle' => 'Process Improvement',
                    'detailContent' => '<p>Process optimization analysis reveals efficiency improvements across key business operations.</p>'
                },
                new Map<String, Object>{
                    'title' => 'Performance Dashboard Update',
                    'description' => 'Real-time KPI tracking shows 15% improvement in key metrics',
                    'icon' => 'utility:chart',
                    'buttonLabel' => 'View Dashboard',
                    'buttonLink' => '#',
                    'detailTitle' => 'Performance Metrics',
                    'detailContent' => '<p>Performance dashboard reveals positive trends in key business indicators and operational efficiency.</p>'
                }
            },
            'lowTouch' => new List<Object>{
                new Map<String, Object>{
                    'title' => 'Monthly Business Review',
                    'description' => 'Review performance metrics and market trends',
                    'icon' => 'utility:chart',
                    'buttonLabel' => 'View Metrics',
                    'buttonLink' => '#',
                    'detailTitle' => 'Business Review',
                    'detailContent' => '<p>Monthly business review covering performance metrics, market trends, and operational insights.</p>'
                },
                new Map<String, Object>{
                    'title' => 'Strategic Initiative Planning',
                    'description' => 'Approve recommended strategic initiatives for next quarter',
                    'icon' => 'utility:approval',
                    'buttonLabel' => 'Review Plans',
                    'buttonLink' => '#',
                    'detailTitle' => 'Strategic Planning',
                    'detailContent' => '<p>Strategic initiative review including resource allocation and timeline planning for key business objectives.</p>'
                }
            },
            'highTouch' => new List<Object>{
                new Map<String, Object>{
                    'title' => 'Executive Strategy Session',
                    'description' => 'Strategic planning meeting with senior leadership team',
                    'icon' => 'utility:people',
                    'buttonLabel' => 'View Agenda',
                    'buttonLink' => '#',
                    'detailTitle' => 'Executive Planning',
                    'detailContent' => '<p>Executive strategy session focusing on growth opportunities, competitive positioning, and market expansion.</p>'
                },
                new Map<String, Object>{
                    'title' => 'Key Account Strategy',
                    'description' => 'Strategic review of top client relationships and growth opportunities',
                    'icon' => 'utility:strategy',
                    'buttonLabel' => 'View Strategy',
                    'buttonLink' => '#',
                    'detailTitle' => 'Account Management',
                    'detailContent' => '<p>Strategic account planning including relationship management and growth opportunity identification.</p>'
                }
            },
            'siteVisits' => new List<Object>{
                new Map<String, Object>{
                    'title' => 'Corporate Headquarters Tour',
                    'description' => 'Strategic facility tour and stakeholder meetings',
                    'icon' => 'utility:location',
                    'buttonLabel' => 'View Schedule',
                    'buttonLink' => '#',
                    'detailTitle' => 'Facility Tour',
                    'detailContent' => '<p>Comprehensive facility tour including operational reviews and strategic stakeholder meetings.</p>'
                },
                new Map<String, Object>{
                    'title' => 'Client Site Assessment',
                    'description' => 'On-site evaluation of client operations and partnership opportunities',
                    'icon' => 'utility:location',
                    'buttonLabel' => 'Schedule Visit',
                    'buttonLink' => '#',
                    'detailTitle' => 'Client Assessment',
                    'detailContent' => '<p>Client site assessment focusing on operational efficiency and strategic partnership opportunities.</p>'
                }
            }
        };
    }
    
    private static Map<String, Object> getHealthcareFallback() {
        return new Map<String, Object>{
            'noTouch' => new List<Object>{
                new Map<String, Object>{
                    'title' => 'Patient Flow Optimization',
                    'description' => 'AI optimized scheduling reduced wait times by 25%',
                    'icon' => 'utility:success',
                    'buttonLabel' => 'View Results',
                    'buttonLink' => '#',
                    'detailTitle' => 'Flow Optimization',
                    'detailContent' => '<p>AI-driven scheduling optimization has significantly improved patient flow and satisfaction.</p>'
                }
            },
            'lowTouch' => new List<Object>{
                new Map<String, Object>{
                    'title' => 'Equipment Utilization Review',
                    'description' => 'Monthly review of medical equipment usage and optimization',
                    'icon' => 'utility:chart',
                    'buttonLabel' => 'View Report',
                    'buttonLink' => '#',
                    'detailTitle' => 'Equipment Analysis',
                    'detailContent' => '<p>Equipment utilization analysis reveals optimization opportunities and capacity planning insights.</p>'
                }
            },
            'highTouch' => new List<Object>{
                new Map<String, Object>{
                    'title' => 'Healthcare Technology Strategy',
                    'description' => 'Strategic planning session for technology initiatives',
                    'icon' => 'utility:strategy',
                    'buttonLabel' => 'View Strategy',
                    'buttonLink' => '#',
                    'detailTitle' => 'Technology Planning',
                    'detailContent' => '<p>Healthcare technology strategy session focusing on patient outcomes and operational efficiency.</p>'
                }
            },
            'siteVisits' => new List<Object>{
                new Map<String, Object>{
                    'title' => 'Medical Technology Assessment',
                    'description' => 'On-site evaluation of new medical technology implementation',
                    'icon' => 'utility:location',
                    'buttonLabel' => 'View Details',
                    'buttonLink' => '#',
                    'detailTitle' => 'Technology Assessment',
                    'detailContent' => '<p>Medical technology assessment including implementation planning and staff training requirements.</p>'
                }
            }
        };
    }
    
    private static Map<String, Object> getTechnologyFallback() {
        return new Map<String, Object>{
            'noTouch' => new List<Object>{
                new Map<String, Object>{
                    'title' => 'System Performance Monitoring',
                    'description' => 'AI monitoring achieved 99.9% uptime across all systems',
                    'icon' => 'utility:success',
                    'buttonLabel' => 'View Dashboard',
                    'buttonLink' => '#',
                    'detailTitle' => 'System Performance',
                    'detailContent' => '<p>Automated system monitoring with AI-driven anomaly detection maintains optimal performance.</p>'
                }
            },
            'lowTouch' => new List<Object>{
                new Map<String, Object>{
                    'title' => 'Software License Review',
                    'description' => 'Quarterly review of software licensing and optimization opportunities',
                    'icon' => 'utility:apps',
                    'buttonLabel' => 'View Report',
                    'buttonLink' => '#',
                    'detailTitle' => 'License Management',
                    'detailContent' => '<p>Software license analysis identifies optimization opportunities and cost savings.</p>'
                }
            },
            'highTouch' => new List<Object>{
                new Map<String, Object>{
                    'title' => 'Technology Roadmap Planning',
                    'description' => 'Strategic technology planning session with executive team',
                    'icon' => 'utility:strategy',
                    'buttonLabel' => 'View Roadmap',
                    'buttonLink' => '#',
                    'detailTitle' => 'Technology Strategy',
                    'detailContent' => '<p>Technology roadmap planning including digital transformation and infrastructure investments.</p>'
                }
            },
            'siteVisits' => new List<Object>{
                new Map<String, Object>{
                    'title' => 'Data Center Assessment',
                    'description' => 'Infrastructure assessment and optimization review',
                    'icon' => 'utility:location',
                    'buttonLabel' => 'View Details',
                    'buttonLink' => '#',
                    'detailTitle' => 'Infrastructure Review',
                    'detailContent' => '<p>Data center assessment including infrastructure optimization and scalability planning.</p>'
                }
            }
        };
    }
}