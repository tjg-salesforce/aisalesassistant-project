({
    // Helper method to show a toast notification
    showToast : function(title, message, type) {
        var toastEvent = $A.get("e.force:showToast");
        if (toastEvent) {
            toastEvent.setParams({
                "title": title,
                "message": message,
                "type": type || "info"
            });
            toastEvent.fire();
        }
    },
    
    // Helper method to navigate to a URL
    navigateToURL : function(url) {
        // Validate URL before navigation to prevent CSP violations
        if (!url || url.trim() === '' || url === '<URL>' || url.includes('<URL>')) {
            console.log('Invalid or placeholder URL detected, skipping navigation:', url);
            return;
        }
        
        // Additional validation for URL format
        try {
            // Check if it's a valid URL format
            var urlPattern = /^(https?:\/\/)|(\/)/;
            if (!urlPattern.test(url.trim())) {
                console.log('URL does not match expected format (should start with http://, https://, or /), skipping navigation:', url);
                return;
            }
        } catch (e) {
            console.log('URL validation error, skipping navigation:', url, e);
            return;
        }
        
        // First try to use the lightning navigation service
        var navService = $A.get("e.force:navigateToURL");
        if (navService) {
            navService.setParams({
                "url": url
            });
            navService.fire();
        } else {
            // Fallback to window.open
            window.open(url, '_blank');
        }
    },
    
    // Helper method to save component state using Salesforce session storage
    saveState : function(component) {
        var state = {
            // No Touch Section
            noTouch1Visible: component.get("v.noTouch1Visible"),
            noTouch2Visible: component.get("v.noTouch2Visible"),
            noTouch3Visible: component.get("v.noTouch3Visible"),
            noTouch1DetailExpanded: component.get("v.noTouch1DetailExpanded"),
            noTouch2DetailExpanded: component.get("v.noTouch2DetailExpanded"),
            noTouch3DetailExpanded: component.get("v.noTouch3DetailExpanded"),
            
            // Low Touch Section
            lowTouch1Visible: component.get("v.lowTouch1Visible"),
            lowTouch2Visible: component.get("v.lowTouch2Visible"),
            lowTouch3Visible: component.get("v.lowTouch3Visible"),
            lowTouch1DetailExpanded: component.get("v.lowTouch1DetailExpanded"),
            lowTouch2DetailExpanded: component.get("v.lowTouch2DetailExpanded"),
            lowTouch3DetailExpanded: component.get("v.lowTouch3DetailExpanded"),
            
            // Site Visits Section
            siteVisits1Visible: component.get("v.siteVisits1Visible"),
            siteVisits2Visible: component.get("v.siteVisits2Visible"),
            siteVisits3Visible: component.get("v.siteVisits3Visible"),
            siteVisits1DetailExpanded: component.get("v.siteVisits1DetailExpanded"),
            siteVisits2DetailExpanded: component.get("v.siteVisits2DetailExpanded"),
            siteVisits3DetailExpanded: component.get("v.siteVisits3DetailExpanded"),
            
            // High Touch Section
            highTouch1Visible: component.get("v.highTouch1Visible"),
            highTouch2Visible: component.get("v.highTouch2Visible"),
            highTouch3Visible: component.get("v.highTouch3Visible"),
            highTouch1DetailExpanded: component.get("v.highTouch1DetailExpanded"),
            highTouch2DetailExpanded: component.get("v.highTouch2DetailExpanded"),
            highTouch3DetailExpanded: component.get("v.highTouch3DetailExpanded")
        };
        
        localStorage.setItem('aiSalesAssistantState', JSON.stringify(state));
    },
    
    // Helper method to load component state from storage
    loadState : function(component) {
        var savedState = localStorage.getItem('aiSalesAssistantState');
        if (savedState) {
            try {
                var state = JSON.parse(savedState);
                
                // No Touch Section
                if (state.noTouch1Visible !== undefined) component.set("v.noTouch1Visible", state.noTouch1Visible);
                if (state.noTouch2Visible !== undefined) component.set("v.noTouch2Visible", state.noTouch2Visible);
                if (state.noTouch3Visible !== undefined) component.set("v.noTouch3Visible", state.noTouch3Visible);
                if (state.noTouch1DetailExpanded !== undefined) component.set("v.noTouch1DetailExpanded", state.noTouch1DetailExpanded);
                if (state.noTouch2DetailExpanded !== undefined) component.set("v.noTouch2DetailExpanded", state.noTouch2DetailExpanded);
                if (state.noTouch3DetailExpanded !== undefined) component.set("v.noTouch3DetailExpanded", state.noTouch3DetailExpanded);
                
                // Low Touch Section
                if (state.lowTouch1Visible !== undefined) component.set("v.lowTouch1Visible", state.lowTouch1Visible);
                if (state.lowTouch2Visible !== undefined) component.set("v.lowTouch2Visible", state.lowTouch2Visible);
                if (state.lowTouch3Visible !== undefined) component.set("v.lowTouch3Visible", state.lowTouch3Visible);
                if (state.lowTouch1DetailExpanded !== undefined) component.set("v.lowTouch1DetailExpanded", state.lowTouch1DetailExpanded);
                if (state.lowTouch2DetailExpanded !== undefined) component.set("v.lowTouch2DetailExpanded", state.lowTouch2DetailExpanded);
                if (state.lowTouch3DetailExpanded !== undefined) component.set("v.lowTouch3DetailExpanded", state.lowTouch3DetailExpanded);
                
                // Site Visits Section
                if (state.siteVisits1Visible !== undefined) component.set("v.siteVisits1Visible", state.siteVisits1Visible);
                if (state.siteVisits2Visible !== undefined) component.set("v.siteVisits2Visible", state.siteVisits2Visible);
                if (state.siteVisits3Visible !== undefined) component.set("v.siteVisits3Visible", state.siteVisits3Visible);
                if (state.siteVisits1DetailExpanded !== undefined) component.set("v.siteVisits1DetailExpanded", state.siteVisits1DetailExpanded);
                if (state.siteVisits2DetailExpanded !== undefined) component.set("v.siteVisits2DetailExpanded", state.siteVisits2DetailExpanded);
                if (state.siteVisits3DetailExpanded !== undefined) component.set("v.siteVisits3DetailExpanded", state.siteVisits3DetailExpanded);
                
                // High Touch Section
                if (state.highTouch1Visible !== undefined) component.set("v.highTouch1Visible", state.highTouch1Visible);
                if (state.highTouch2Visible !== undefined) component.set("v.highTouch2Visible", state.highTouch2Visible);
                if (state.highTouch3Visible !== undefined) component.set("v.highTouch3Visible", state.highTouch3Visible);
                if (state.highTouch1DetailExpanded !== undefined) component.set("v.highTouch1DetailExpanded", state.highTouch1DetailExpanded);
                if (state.highTouch2DetailExpanded !== undefined) component.set("v.highTouch2DetailExpanded", state.highTouch2DetailExpanded);
                if (state.highTouch3DetailExpanded !== undefined) component.set("v.highTouch3DetailExpanded", state.highTouch3DetailExpanded);
                
            } catch (e) {
                console.error('Error loading state:', e);
            }
        }
    },
    
    // Helper to validate the saved state object
    validateStateObject : function(state) {
        // Check if state has the expected properties
        if (!state) return false;
        
        // Ensure state has boolean values for all visibility attributes
        var requiredProps = [
            'noTouch1Visible', 'noTouch2Visible', 'noTouch3Visible',
            'lowTouch1Visible', 'lowTouch2Visible', 'lowTouch3Visible',
            'highTouch1Visible', 'highTouch2Visible', 'highTouch3Visible'
        ];
        
        // Only include site visits in validation if the section is enabled
        // Note: We don't have component context here, so we'll validate site visits if they exist in state
        if (state.hasOwnProperty('siteVisits1Visible') || 
            state.hasOwnProperty('siteVisits2Visible') || 
            state.hasOwnProperty('siteVisits3Visible')) {
            requiredProps.push('siteVisits1Visible', 'siteVisits2Visible', 'siteVisits3Visible');
        }
        
        for (var i = 0; i < requiredProps.length; i++) {
            var prop = requiredProps[i];
            if (typeof state[prop] !== 'boolean') {
                return false;
            }
        }
        
        // Check if all items are hidden (this is probably an invalid state)
        var allHidden = !state.noTouch1Visible && !state.noTouch2Visible && !state.noTouch3Visible &&
                        !state.lowTouch1Visible && !state.lowTouch2Visible && !state.lowTouch3Visible &&
                        !state.highTouch1Visible && !state.highTouch2Visible && !state.highTouch3Visible;
        
        // Include site visits in the "all hidden" check only if they exist in the state
        if (state.hasOwnProperty('siteVisits1Visible')) {
            allHidden = allHidden && !state.siteVisits1Visible && !state.siteVisits2Visible && !state.siteVisits3Visible;
        }
        
        // If all items are hidden, consider this an invalid state
        if (allHidden) {
            return false;
        }
        
        return true;
    },
    
    // Helper to reset component state to defaults
    resetToDefaults : function(component) {
        // No Touch Section
        component.set("v.noTouch1Visible", true);
        component.set("v.noTouch2Visible", true);
        component.set("v.noTouch3Visible", true);
        component.set("v.noTouch1DetailExpanded", false);
        component.set("v.noTouch2DetailExpanded", false);
        component.set("v.noTouch3DetailExpanded", false);
        
        // Low Touch Section
        component.set("v.lowTouch1Visible", true);
        component.set("v.lowTouch2Visible", true);
        component.set("v.lowTouch3Visible", true);
        component.set("v.lowTouch1DetailExpanded", false);
        component.set("v.lowTouch2DetailExpanded", false);
        component.set("v.lowTouch3DetailExpanded", false);
        
        // Site Visits Section
        component.set("v.siteVisits1Visible", true);
        component.set("v.siteVisits2Visible", true);
        component.set("v.siteVisits3Visible", true);
        component.set("v.siteVisits1DetailExpanded", false);
        component.set("v.siteVisits2DetailExpanded", false);
        component.set("v.siteVisits3DetailExpanded", false);
        
        // High Touch Section
        component.set("v.highTouch1Visible", true);
        component.set("v.highTouch2Visible", true);
        component.set("v.highTouch3Visible", true);
        component.set("v.highTouch1DetailExpanded", false);
        component.set("v.highTouch2DetailExpanded", false);
        component.set("v.highTouch3DetailExpanded", false);
    },
    
    // Helper to calculate number of visible tasks in No Touch section
    getNoTouchTaskCount : function(component) {
        var count = 0;
        if (component.get("v.noTouch1Visible")) count++;
        if (component.get("v.noTouch2Visible")) count++;
        if (component.get("v.noTouch3Visible")) count++;
        return count;
    },
    
    // Helper to calculate number of visible tasks in Low Touch section
    getLowTouchTaskCount : function(component) {
        var count = 0;
        if (component.get("v.lowTouch1Visible")) count++;
        if (component.get("v.lowTouch2Visible")) count++;
        if (component.get("v.lowTouch3Visible")) count++;
        return count;
    },
    
    // Helper to calculate number of visible tasks in Site Visits section
    getSiteVisitsTaskCount : function(component) {
        var count = 0;
        if (component.get("v.siteVisits1Visible")) count++;
        if (component.get("v.siteVisits2Visible")) count++;
        if (component.get("v.siteVisits3Visible")) count++;
        return count;
    },
    
    // Helper to calculate number of visible tasks in High Touch section
    getHighTouchTaskCount : function(component) {
        var count = 0;
        if (component.get("v.highTouch1Visible")) count++;
        if (component.get("v.highTouch2Visible")) count++;
        if (component.get("v.highTouch3Visible")) count++;
        return count;
    },
    
    // Helper to validate and fix icon names
    validateIconNames : function(component) {
        var iconAttributes = [
            'noTouch1Icon', 'noTouch2Icon', 'noTouch3Icon',
            'lowTouch1Icon', 'lowTouch2Icon', 'lowTouch3Icon',
            'siteVisits1Icon', 'siteVisits2Icon', 'siteVisits3Icon',
            'highTouch1Icon', 'highTouch2Icon', 'highTouch3Icon',
            'noTouchSectionIcon', 'lowTouchSectionIcon', 'highTouchSectionIcon', 'siteVisitsSectionIcon'
        ];
        
        var defaultIcons = {
            'noTouch1Icon': 'utility:success',
            'noTouch2Icon': 'utility:email',
            'noTouch3Icon': 'utility:knowledge_base',
            'lowTouch1Icon': 'utility:priority',
            'lowTouch2Icon': 'utility:approval',
            'lowTouch3Icon': 'utility:groups',
            'siteVisits1Icon': 'utility:location',
            'siteVisits2Icon': 'utility:location',
            'siteVisits3Icon': 'utility:location',
            'highTouch1Icon': 'utility:opportunity',
            'highTouch2Icon': 'utility:warning',
            'highTouch3Icon': 'utility:user',
            'noTouchSectionIcon': 'utility:announcement',
            'lowTouchSectionIcon': 'utility:check',
            'highTouchSectionIcon': 'utility:high_velocity_sales',
            'siteVisitsSectionIcon': 'utility:location'
        };
        
        for (var i = 0; i < iconAttributes.length; i++) {
            var attr = iconAttributes[i];
            var iconName = component.get("v." + attr);
            
            if (!iconName || iconName === null || iconName === undefined || iconName === "") {
                console.warn("Icon attribute " + attr + " is null/empty, setting to default:", defaultIcons[attr]);
                component.set("v." + attr, defaultIcons[attr]);
            }
        }
    },

    // Helper to set button colors based on the buttonColor attribute
    setButtonColors : function(component) {
        var buttonColor = component.get("v.buttonColor");
        if (!buttonColor) {
            buttonColor = "0576D3"; // Default color
        }
        
        console.log("Setting button colors with:", buttonColor);
        
        // Normalize the hex code (ensure it starts with #)
        var normalizedColor = this.normalizeHexCode(buttonColor);
        
        // Generate hover color (darker version)
        var hoverColor = this.darkenHexColor(normalizedColor, 20);
        
        console.log("Normalized color:", normalizedColor, "Hover color:", hoverColor);
        
        // SIMPLE APPROACH: Just set CSS custom properties - works for refresh button and links
        var componentElement = component.getElement();
        console.log("Component element:", componentElement);
        
        if (componentElement) {
            // Set CSS custom properties on the component root
            componentElement.style.setProperty('--dynamic-button-color', normalizedColor);
            componentElement.style.setProperty('--dynamic-button-hover-color', hoverColor);
            
            console.log("CSS variables set:", '--dynamic-button-color =', normalizedColor, '--dynamic-button-hover-color =', hoverColor);
            
            // Debug CSS variables after a delay to see what's happening
            this.debugCSSVariables(component);
        } else {
            // Fallback with a delay if component element isn't ready
            var self = this;
            window.setTimeout(
                $A.getCallback(function() {
                    var delayedElement = component.getElement();
                    if (delayedElement) {
                        delayedElement.style.setProperty('--dynamic-button-color', normalizedColor);
                        delayedElement.style.setProperty('--dynamic-button-hover-color', hoverColor);
                        console.log("CSS variables set (delayed):", '--dynamic-button-color =', normalizedColor, '--dynamic-button-hover-color =', hoverColor);
                        
                        // Debug CSS variables after a delay to see what's happening
                        self.debugCSSVariables(component);
                    }
                }), 200
            );
        }
    },
    
    // Debug function to understand CSS variables and button styling
    debugCSSVariables : function(component) {
        window.setTimeout(
            $A.getCallback(function() {
                var componentElement = component.getElement();
                if (!componentElement) {
                    console.log("DEBUG: No component element for CSS debugging");
                    return;
                }
                
                console.log("=== CSS VARIABLES DEBUG ===");
                
                // Check if CSS variables are accessible
                var computedStyle = window.getComputedStyle(componentElement);
                var buttonColor = computedStyle.getPropertyValue('--dynamic-button-color');
                var hoverColor = computedStyle.getPropertyValue('--dynamic-button-hover-color');
                
                console.log("CSS var --dynamic-button-color:", buttonColor);
                console.log("CSS var --dynamic-button-hover-color:", hoverColor);
                
                // Try broader selectors to find elements
                var allLightningButtons = componentElement.querySelectorAll('lightning-button');
                var allButtons = componentElement.querySelectorAll('button');
                var allLinks = componentElement.querySelectorAll('a');
                
                console.log("Found", allLightningButtons.length, "total lightning-button elements");
                console.log("Found", allButtons.length, "total button elements"); 
                console.log("Found", allLinks.length, "total link elements");
                
                // Inspect the first few lightning-button elements to see their structure
                for (var i = 0; i < Math.min(3, allLightningButtons.length); i++) {
                    var btn = allLightningButtons[i];
                    console.log("Lightning-button", i, "classes:", btn.className);
                    console.log("Lightning-button", i, "innerHTML preview:", btn.innerHTML.substring(0, 100) + "...");
                }
                
                // Now try the original selectors
                var actionButtons = componentElement.querySelectorAll('lightning-button.action-button, lightning-button.custom-button');
                var refreshButtons = componentElement.querySelectorAll('footer lightning-button');
                
                console.log("Using specific selectors:");
                console.log("Found", actionButtons.length, "action buttons with classes");
                console.log("Found", refreshButtons.length, "refresh buttons in footer");
                
                // Check computed styles of first action button vs refresh button
                if (actionButtons.length > 0) {
                    var actionBtn = actionButtons[0];
                    var actionComputed = window.getComputedStyle(actionBtn);
                    console.log("Action button computed background:", actionComputed.backgroundColor);
                    console.log("Action button computed border:", actionComputed.borderColor);
                    
                    // Check if it has the CSS variable value
                    var cssVarValue = actionComputed.getPropertyValue('background-color');
                    console.log("Action button background-color value:", cssVarValue);
                }
                
                if (refreshButtons.length > 0) {
                    var refreshBtn = refreshButtons[0];
                    var refreshComputed = window.getComputedStyle(refreshBtn);
                    console.log("Refresh button computed background:", refreshComputed.backgroundColor);
                    console.log("Refresh button computed border:", refreshComputed.borderColor);
                }
                
                if (allLinks.length > 0) {
                    var link = allLinks[0];
                    var linkComputed = window.getComputedStyle(link);
                    console.log("Link computed color:", linkComputed.color);
                }
                
                console.log("=== END CSS DEBUG ===");
                
            }), 1000
        );
    },
    
    // Helper to normalize hex code (add # if missing, validate format)
    normalizeHexCode : function(hexCode) {
        if (!hexCode) return "#0576D3";
        
        // Remove any whitespace
        hexCode = hexCode.trim();
        
        // Add # if missing
        if (!hexCode.startsWith('#')) {
            hexCode = '#' + hexCode;
        }
        
        // Validate hex format (3 or 6 characters after #)
        var hexPattern = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
        if (!hexPattern.test(hexCode)) {
            console.warn('Invalid hex color code: ' + hexCode + '. Using default color.');
            return "#0576D3";
        }
        
        // Convert 3-digit hex to 6-digit
        if (hexCode.length === 4) {
            hexCode = '#' + hexCode[1] + hexCode[1] + hexCode[2] + hexCode[2] + hexCode[3] + hexCode[3];
        }
        
        return hexCode.toUpperCase();
    },
    
    // Helper to darken a hex color by a percentage
    darkenHexColor : function(hexColor, percent) {
        // Remove # and convert to RGB
        var hex = hexColor.replace('#', '');
        var r = parseInt(hex.substr(0, 2), 16);
        var g = parseInt(hex.substr(2, 2), 16);
        var b = parseInt(hex.substr(4, 2), 16);
        
        // Darken by reducing each component
        r = Math.max(0, Math.floor(r * (100 - percent) / 100));
        g = Math.max(0, Math.floor(g * (100 - percent) / 100));
        b = Math.max(0, Math.floor(b * (100 - percent) / 100));
        
        // Convert back to hex
        var darkerHex = '#' + 
            r.toString(16).padStart(2, '0') + 
            g.toString(16).padStart(2, '0') + 
            b.toString(16).padStart(2, '0');
        
        return darkerHex.toUpperCase();
    },
    
    // Helper to apply customer type examples (B2B vs B2C)
    applyCustomerTypeExamples : function(component, customerType) {
        console.log("Applying customer type examples for:", customerType);
        
        if (customerType === "B2C") {
            this.applyB2CExamples(component);
        } else {
            // Default to B2B if not B2C
            this.applyB2BExamples(component);
        }
    },
    
    // Helper to apply B2B customer examples
    applyB2BExamples : function(component) {
        // No Touch Section - B2B Examples
        component.set("v.noTouch1Title", "Retailer outreach completed");
        component.set("v.noTouch1Desc", "AI sent promotional emails to 47 retail partners with no recent orders");
        component.set("v.noTouch1DetailTitle", "Automated Retailer Engagement");
        component.set("v.noTouch1DetailContent", "AI identified 47 retail partners who haven't placed orders in 90+ days. Automated email campaign sent with new product catalogs and volume discount offers. 12 retailers opened emails, 3 requested sales meetings. Average retailer value: $45,000 annually. Cross-sell opportunity: exclusive product line access.");
        
        component.set("v.noTouch2Title", "Price change alerts sent");
        component.set("v.noTouch2Desc", "AI notified 23 distributors with active quotes about 5% price increase effective next week");
        component.set("v.noTouch2DetailTitle", "Price Increase Proactive Outreach");
        component.set("v.noTouch2DetailContent", "AI integrated with inventory system to identify 23 distributors with active quotes totaling $340,000. Automated alerts sent about 5% price increase effective Friday. 8 distributors responded, 5 placed expedited orders. Cross-sell opportunity: volume pricing for qualifying orders. Average order value: $14,800.");
        
        component.set("v.noTouch3Title", "Meeting reschedule handled");
        component.set("v.noTouch3Desc", "AI responded to Metro Distribution's meeting reschedule request with available calendar slots");
        component.set("v.noTouch3DetailTitle", "Calendar Integration and Response");
        component.set("v.noTouch3DetailContent", "AI detected Metro Distribution's meeting reschedule request via calendar integration. Automatically responded with 3 available time slots from your calendar. Meeting rescheduled for tomorrow 2:00 PM. Metro Distribution: $2.1M annual spend, 15 active territories. Cross-sell opportunity: exclusive distribution rights for new product categories.");
        
        // Low Touch Section - B2B Examples
        component.set("v.lowTouch1Title", "Approve bulk pricing campaign");
        component.set("v.lowTouch1Desc", "AI prepared volume discount campaign for 156 wholesale customers");
        component.set("v.lowTouch1ButtonLabel", "Review Campaign");
        component.set("v.lowTouch1DetailTitle", "Volume Discount Campaign");
        component.set("v.lowTouch1DetailContent", "AI identified 156 wholesale customers eligible for tiered volume discounts. Campaign includes personalized benefits: bulk pricing, extended payment terms, dedicated account manager. Expected conversion rate: 23%, Average revenue increase: $18,000 per customer. Campaign ready for your approval - one-click send to all contacts.");
        
        component.set("v.lowTouch2Title", "Review credit applications");
        component.set("v.lowTouch2Desc", "8 distributor credit applications pre-screened by AI, ready for approval");
        component.set("v.lowTouch2ButtonLabel", "Review Applications");
        component.set("v.lowTouch2DetailTitle", "AI-Pre-screened Credit Applications");
        component.set("v.lowTouch2DetailContent", "AI analyzed 8 credit applications using your company's risk assessment model. 6 applications recommended for approval, 2 require manual review. Average requested credit limit: $85,000, Average annual revenue: $210,000. Cross-sell opportunity: exclusive product access included with approved credit. Total potential portfolio value: $680,000 annually.");
        
        component.set("v.lowTouch3Title", "Schedule product training session");
        component.set("v.lowTouch3Desc", "AI identified 12 retailers ready for new product line training");
        component.set("v.lowTouch3ButtonLabel", "Schedule Training");
        component.set("v.lowTouch3DetailTitle", "Product Line Training");
        component.set("v.lowTouch3DetailContent", "AI identified 12 retailers with recent growth suitable for new product line training. Training includes: product features, display optimization, sales techniques. Expected adoption rate: 78%, Average sales increase: 22%. Cross-sell opportunity: exclusive territory rights for training participants.");
        
        // High Touch Section - B2B Examples
        component.set("v.highTouch1Title", "Major distributor opportunity");
        component.set("v.highTouch1Desc", "Regional Distribution Co evaluating exclusive territory contract");
        component.set("v.highTouch1ButtonLabel", "Review Opportunity");
        component.set("v.highTouch1DetailTitle", "Exclusive Territory Opportunity");
        component.set("v.highTouch1DetailContent", "Regional Distribution Co: $12M annual revenue, 45 retail locations, 85% customer retention rate. Evaluating exclusive territory contract: 3-year agreement, $2.4M annual commitment, exclusive distribution for tri-state area. Current supplier: competitor with 12% higher pricing. Cross-sell opportunity: co-marketing fund for promotional campaigns.");
        
        component.set("v.highTouch2Title", "At-risk distributor account");
        component.set("v.highTouch2Desc", "City Wholesale showing reduced orders - schedule meeting to discuss partnership benefits");
        component.set("v.highTouch2ButtonLabel", "Review Account");
        component.set("v.highTouch2DetailTitle", "Account Risk Assessment");
        component.set("v.highTouch2DetailContent", "City Wholesale: 8-year partner, $1.8M annual spend, exclusive distributor. Recent activity: 67% order reduction, 3 missed payments, territory disputes. Risk factors: new competitor offering 15% discount, territory pipeline down 40%. Recovery strategy: enhanced partnership benefits, volume pricing incentives, dedicated account manager.");
        
        component.set("v.highTouch3Title", "Executive touchpoint");
        component.set("v.highTouch3Desc", "National Retail Chain CEO requested product portfolio demo and partnership overview");
        component.set("v.highTouch3ButtonLabel", "Schedule Demo");
        component.set("v.highTouch3DetailTitle", "Executive Engagement Strategy");
        component.set("v.highTouch3DetailContent", "National Retail Chain CEO: Sarah Johnson, 15 years in industry, expansion-focused leader. Company: $80M annual revenue, 1,200 locations, expanding to 3 new states. Product interest: private label opportunities, supply chain integration. Partnership opportunity: national distribution agreement, potential value: $1.8M annually.");
        
        // Site Visits Section - B2B Examples
        component.set("v.siteVisits1Title", "Regional Distribution Center");
        component.set("v.siteVisits1Desc", "Metro Distribution - Review warehouse optimization for new product lines");
        component.set("v.siteVisits1ButtonLabel", "Review Details");
        component.set("v.siteVisits1DetailTitle", "Distribution Center Analysis");
        component.set("v.siteVisits1DetailContent", "Regional distribution facility valued at $4.5M annually. Metro Distribution: $1.2M annual spend, exclusive partner since 2021. Warehouse optimization requirement: 8,500 sq ft new product storage. Current challenges: inventory management, delivery optimization. Opportunity: exclusive distribution agreement, potential revenue: $680,000.");
        
        component.set("v.siteVisits2Title", "City Mall Flagship - DELIVERY DELAY");
        component.set("v.siteVisits2Desc", "Premium Retailers - CRITICAL: 2-week delivery delay on seasonal inventory, discuss solutions");
        component.set("v.siteVisits2ButtonLabel", "Review Account");
        component.set("v.siteVisits2DetailTitle", "Delivery Delay Alert");
        component.set("v.siteVisits2DetailContent", "CRITICAL: 2-week delivery delay on seasonal inventory for flagship store. Premium Retailers: 15-year partner, $2.8M annual spend, exclusive retailer. Holiday season timeline at risk. Solutions: expedite from alternate warehouse, upgrade to priority shipping, offer alternative product mix.");
        
        component.set("v.siteVisits3Title", "New Store Opening");
        component.set("v.siteVisits3Desc", "Regional Chain - Assess product mix and display needs for 50,000 sq ft flagship location");
        component.set("v.siteVisits3ButtonLabel", "Review Project");
        component.set("v.siteVisits3DetailTitle", "New Location Assessment");
        component.set("v.siteVisits3DetailContent", "50,000 sq ft flagship store for regional retail chain. Regional Chain: new partner, $1.2M projected revenue, growth-focused company. Product requirements: full product line, premium displays, 3-year exclusive agreement. Opportunity: flagship partnership, exclusive territory rights.");
    },
    
    // Helper to apply B2C customer examples
    applyB2CExamples : function(component) {
        // No Touch Section - B2C Examples
        component.set("v.noTouch1Title", "Customer re-engagement completed");
        component.set("v.noTouch1Desc", "AI sent personalized offers to 47 dormant customers with purchase history");
        component.set("v.noTouch1DetailTitle", "Automated Customer Re-engagement");
        component.set("v.noTouch1DetailContent", "AI identified 47 customers who haven't purchased in 90+ days. Automated email campaign sent with personalized product recommendations and 15% discount codes. 12 customers opened emails, 3 made purchases. Average customer value: $450 annually. Cross-sell opportunity: loyalty program enrollment.");
        
        component.set("v.noTouch2Title", "Sale notifications sent");
        component.set("v.noTouch2Desc", "AI notified 23 VIP customers about early access to upcoming 30% off sale");
        component.set("v.noTouch2DetailTitle", "VIP Early Access Campaign");
        component.set("v.noTouch2DetailContent", "AI integrated with customer database to identify 23 VIP customers for exclusive early sale access. Automated notifications sent about 30% off sale starting tomorrow. 8 customers responded, 5 placed pre-sale orders. Cross-sell opportunity: premium membership upgrade. Average order value: $180.");
        
        component.set("v.noTouch3Title", "Appointment reschedule handled");
        component.set("v.noTouch3Desc", "AI responded to Sarah Johnson's consultation reschedule request with available time slots");
        component.set("v.noTouch3DetailTitle", "Appointment Management and Response");
        component.set("v.noTouch3DetailContent", "AI detected Sarah Johnson's consultation reschedule request via calendar integration. Automatically responded with 3 available time slots from your calendar. Appointment rescheduled for tomorrow 2:00 PM. Sarah Johnson: $2,100 annual spend, 15 purchases this year. Cross-sell opportunity: premium consultation package.");
        
        // Low Touch Section - B2C Examples
        component.set("v.lowTouch1Title", "Approve loyalty campaign");
        component.set("v.lowTouch1Desc", "AI prepared premium membership upgrade campaign for 156 eligible customers");
        component.set("v.lowTouch1ButtonLabel", "Review Campaign");
        component.set("v.lowTouch1DetailTitle", "Premium Membership Campaign");
        component.set("v.lowTouch1DetailContent", "AI identified 156 customers eligible for premium membership upgrade. Campaign includes personalized benefits: free shipping, early sale access, birthday rewards. Expected conversion rate: 23%, Average revenue increase: $180 per customer. Campaign ready for your approval - one-click send to all contacts.");
        
        component.set("v.lowTouch2Title", "Review feedback responses");
        component.set("v.lowTouch2Desc", "8 customer service escalations pre-analyzed by AI, ready for personal follow-up");
        component.set("v.lowTouch2ButtonLabel", "Review Responses");
        component.set("v.lowTouch2DetailTitle", "AI-Analyzed Customer Feedback");
        component.set("v.lowTouch2DetailContent", "AI analyzed 8 customer service escalations using sentiment analysis. 6 customers recommended for personal outreach, 2 require product replacement. Average customer value: $850, Average satisfaction score: 7.2/10. Recovery opportunity: personalized service recovery with premium membership offer. Total at-risk revenue: $6,800 annually.");
        
        component.set("v.lowTouch3Title", "Schedule styling consultation");
        component.set("v.lowTouch3Desc", "AI identified 12 customers ready for personal styling consultation");
        component.set("v.lowTouch3ButtonLabel", "Schedule Consultation");
        component.set("v.lowTouch3DetailTitle", "Personal Styling Consultation");
        component.set("v.lowTouch3DetailContent", "AI identified 12 customers with recent purchases suitable for personal styling consultation. Service includes: wardrobe analysis, seasonal trends, personalized recommendations. Expected booking rate: 78%, Average purchase increase: 22%. Cross-sell opportunity: premium styling package for consultation participants.");
        
        // High Touch Section - B2C Examples
        component.set("v.highTouch1Title", "VIP customer opportunity");
        component.set("v.highTouch1Desc", "Emily Rodriguez considering premium annual membership with exclusive benefits");
        component.set("v.highTouch1ButtonLabel", "Review Opportunity");
        component.set("v.highTouch1DetailTitle", "Premium Membership Opportunity");
        component.set("v.highTouch1DetailContent", "Emily Rodriguez: $12,000 annual spend, 45 purchases this year, 85% satisfaction rate. Considering premium annual membership: $240 fee, exclusive products, priority customer service. Current spend pattern: seasonal buyer with brand loyalty. Cross-sell opportunity: gift membership for family members, potential additional revenue: $1,800 annually.");
        
        component.set("v.highTouch2Title", "At-risk VIP customer");
        component.set("v.highTouch2Desc", "Michael Chen showing reduced purchases - schedule meeting to discuss concerns");
        component.set("v.highTouch2ButtonLabel", "Review Account");
        component.set("v.highTouch2DetailTitle", "Customer Risk Assessment");
        component.set("v.highTouch2DetailContent", "Michael Chen: 8-year customer, $1,800 annual spend, premium member. Recent activity: 67% purchase reduction, 3 service complaints, brand switching signals. Risk factors: competitor offering 15% discount, product availability issues. Recovery strategy: personalized service recovery, exclusive offers, dedicated customer specialist assignment.");
        
        component.set("v.highTouch3Title", "Personal shopping appointment");
        component.set("v.highTouch3Desc", "Jessica Williams requested personal shopping consultation for upcoming wedding");
        component.set("v.highTouch3ButtonLabel", "Schedule Appointment");
        component.set("v.highTouch3DetailTitle", "Special Event Consultation");
        component.set("v.highTouch3DetailContent", "Jessica Williams: new customer, high-value potential, special occasion shopper. Wedding consultation request: complete wardrobe planning, accessories, special event styling. Estimated project value: $8,000, timeline: 6 months. Cross-sell opportunity: bride and bridesmaids packages, honeymoon wardrobe, ongoing styling service.");
        
        // Site Visits Section - B2C Examples
        component.set("v.siteVisits1Title", "Home Design Consultation");
        component.set("v.siteVisits1Desc", "Taylor Family - In-home consultation for complete living room makeover");
        component.set("v.siteVisits1ButtonLabel", "Review Details");
        component.set("v.siteVisits1DetailTitle", "In-Home Design Consultation");
        component.set("v.siteVisits1DetailContent", "Complete living room redesign project for Taylor Family. Project value: $4,500, timeline: 6 weeks. Premium customers since 2021. Room requirements: 850 sq ft space, modern aesthetic, family-friendly design. Opportunity: whole-home design package, potential additional revenue: $6,800.");
        
        component.set("v.siteVisits2Title", "Wardrobe Consultation - URGENT");
        component.set("v.siteVisits2Desc", "Amanda Roberts - CRITICAL: Last-minute styling needed for corporate presentation");
        component.set("v.siteVisits2ButtonLabel", "Review Account");
        component.set("v.siteVisits2DetailTitle", "Urgent Styling Request");
        component.set("v.siteVisits2DetailContent", "CRITICAL: Last-minute professional wardrobe consultation for high-stakes corporate presentation. Amanda Roberts: 15-year customer, $2,800 annual spend, executive client. Presentation in 3 days. Solutions: emergency personal shopping, same-day alterations, complete professional look coordination. Cross-sell opportunity: executive wardrobe maintenance package.");
        
        component.set("v.siteVisits3Title", "New Home Setup");
        component.set("v.siteVisits3Desc", "Johnson Family - Complete home furnishing consultation for 5,000 sq ft new construction");
        component.set("v.siteVisits3ButtonLabel", "Review Project");
        component.set("v.siteVisits3DetailTitle", "New Home Consultation");
        component.set("v.siteVisits3DetailContent", "5,000 sq ft new construction home furnishing project. Johnson Family: new customers, $12,000 projected spend, luxury segment. Home requirements: complete furnishing, 6-month timeline, premium finishes. Opportunity: exclusive design partnership, long-term furnishing relationship, potential value: $18,000 annually.");
    }
})