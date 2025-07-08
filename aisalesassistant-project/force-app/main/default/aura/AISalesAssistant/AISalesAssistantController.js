({
    // Initialize the component
    doInit : function(component, event, helper) {
        console.log("AISalesAssistant component initializing...");
        // Validate icon names first to prevent null icon errors
        helper.validateIconNames(component);
        // Apply customer type examples based on the customerType attribute
        var customerType = component.get("v.customerType");
        helper.applyCustomerTypeExamples(component, customerType);
        // Set button colors based on the buttonColor attribute
        helper.setButtonColors(component);
        // Load saved visibility state from storage
        helper.loadState(component);
        
        // Safeguard against invalid state on component initialization
        window.setTimeout(
            $A.getCallback(function() {
                // Check if all items are hidden, considering the optional site visits section
                var showSiteVisits = component.get("v.showSiteVisitsSection");
                var allHidden = 
                    !component.get("v.noTouch1Visible") && 
                    !component.get("v.noTouch2Visible") && 
                    !component.get("v.noTouch3Visible") &&
                    !component.get("v.lowTouch1Visible") && 
                    !component.get("v.lowTouch2Visible") && 
                    !component.get("v.lowTouch3Visible") &&
                    !component.get("v.highTouch1Visible") && 
                    !component.get("v.highTouch2Visible") && 
                    !component.get("v.highTouch3Visible") &&
                    (!showSiteVisits || (!component.get("v.siteVisits1Visible") && 
                                       !component.get("v.siteVisits2Visible") && 
                                       !component.get("v.siteVisits3Visible")));
                
                if (allHidden) {
                    console.warn("All items are hidden after initialization - resetting to defaults");
                    helper.resetToDefaults(component);
                    helper.saveState(component);
                }
            }), 500
        );
    },
    
    // Handle location change - critical for Console apps where the main tab changes
    handleLocationChange : function(component, event, helper) {
        // Log the location change for debugging
        console.log("Location changed in AISalesAssistant component");
        
        // Re-load saved state when location changes
        helper.loadState(component);
        
        // Verify state is valid after location change
        window.setTimeout(
            $A.getCallback(function() {
                // Check if all items are hidden, considering the optional site visits section
                var showSiteVisits = component.get("v.showSiteVisitsSection");
                var allHidden = 
                    !component.get("v.noTouch1Visible") && 
                    !component.get("v.noTouch2Visible") && 
                    !component.get("v.noTouch3Visible") &&
                    !component.get("v.lowTouch1Visible") && 
                    !component.get("v.lowTouch2Visible") && 
                    !component.get("v.lowTouch3Visible") &&
                    !component.get("v.highTouch1Visible") && 
                    !component.get("v.highTouch2Visible") && 
                    !component.get("v.highTouch3Visible") &&
                    (!showSiteVisits || (!component.get("v.siteVisits1Visible") && 
                                       !component.get("v.siteVisits2Visible") && 
                                       !component.get("v.siteVisits3Visible")));
                
                if (allHidden) {
                    console.warn("All items are hidden after location change - resetting to defaults");
                    helper.resetToDefaults(component);
                }
            }), 500
        );
    },
    
    // Handle button color attribute change
    handleButtonColorChange : function(component, event, helper) {
        console.log("Button color changed to:", component.get("v.buttonColor"));
        helper.setButtonColors(component);
    },
    
    // Handle customer type attribute change
    handleCustomerTypeChange : function(component, event, helper) {
        var customerType = component.get("v.customerType");
        console.log("Customer type changed to:", customerType);
        helper.applyCustomerTypeExamples(component, customerType);
    },
    
    // Handle the refresh insights button click
    refreshInsights : function(component, event, helper) {
        console.log("Refreshing insights...");
        // Reset all visibility attributes to true
        helper.resetToDefaults(component);
        
        // Save the visibility state
        helper.saveState(component);
        
        // Show a toast notification
        helper.showToast("Insights Refreshed", "AI has analyzed your accounts and updated recommendations.", "success");
    },
    
    // Handle a button click on a no-touch item
    handleNoTouchButton : function(component, event, helper) {
        var index = event.getSource().get("v.value");
        var title, url;
        console.log("No-touch button clicked, index:", index);
        
        if (index == 0) {
            title = component.get("v.noTouch1Title");
            url = component.get("v.noTouch1ButtonLink");
            
            // Show toast and navigate first
            helper.showToast("Viewing Details", "Opening: " + title, "info");
            
            // Navigate to the URL if provided
            if (url && url.trim() !== '') {
                helper.navigateToURL(url);
            }
            
            // Add a slight delay before hiding the item
            window.setTimeout(
                $A.getCallback(function() {
                    component.set("v.noTouch1Visible", false);
                    // Save state after update
                    helper.saveState(component);
                }), 1000
            );
        } else if (index == 1) {
            title = component.get("v.noTouch2Title");
            url = component.get("v.noTouch2ButtonLink");
            
            // Show toast and navigate first
            helper.showToast("Viewing Details", "Opening: " + title, "info");
            
            // Navigate to the URL if provided
            if (url && url.trim() !== '') {
                helper.navigateToURL(url);
            }
            
            // Add a slight delay before hiding the item
            window.setTimeout(
                $A.getCallback(function() {
                    component.set("v.noTouch2Visible", false);
                    // Save state after update
                    helper.saveState(component);
                }), 1000
            );
        } else if (index == 2) {
            title = component.get("v.noTouch3Title");
            url = component.get("v.noTouch3ButtonLink");
            
            // Show toast and navigate first
            helper.showToast("Viewing Details", "Opening: " + title, "info");
            
            // Navigate to the URL if provided
            if (url && url.trim() !== '') {
                helper.navigateToURL(url);
            }
            
            // Add a slight delay before hiding the item
            window.setTimeout(
                $A.getCallback(function() {
                    component.set("v.noTouch3Visible", false);
                    // Save state after update
                    helper.saveState(component);
                }), 1000
            );
        }
    },
    
    // Handle a button click on a low-touch action item
    handleLowTouchAction : function(component, event, helper) {
        var index = event.getSource().get("v.value");
        var title, url;
        
        if (index == 0) {
            title = component.get("v.lowTouch1Title");
            url = component.get("v.lowTouch1ButtonLink");
            
            // Show toast and navigate first
            helper.showToast("Action Initiated", "Started: " + title, "info");
            
            // Navigate to the URL if provided
            if (url && url.trim() !== '') {
                helper.navigateToURL(url);
            }
            
            // Add a slight delay before hiding the item
            window.setTimeout(
                $A.getCallback(function() {
                    component.set("v.lowTouch1Visible", false);
                    // Save state after update
                    helper.saveState(component);
                }), 1000
            );
        } else if (index == 1) {
            title = component.get("v.lowTouch2Title");
            url = component.get("v.lowTouch2ButtonLink");
            
            // Show toast and navigate first
            helper.showToast("Action Initiated", "Started: " + title, "info");
            
            // Navigate to the URL if provided
            if (url && url.trim() !== '') {
                helper.navigateToURL(url);
            }
            
            // Add a slight delay before hiding the item
            window.setTimeout(
                $A.getCallback(function() {
                    component.set("v.lowTouch2Visible", false);
                    // Save state after update
                    helper.saveState(component);
                }), 1000
            );
        } else if (index == 2) {
            title = component.get("v.lowTouch3Title");
            url = component.get("v.lowTouch3ButtonLink");
            
            // Show toast and navigate first
            helper.showToast("Action Initiated", "Started: " + title, "info");
            
            // Navigate to the URL if provided
            if (url && url.trim() !== '') {
                helper.navigateToURL(url);
            }
            
            // Add a slight delay before hiding the item
            window.setTimeout(
                $A.getCallback(function() {
                    component.set("v.lowTouch3Visible", false);
                    // Save state after update
                    helper.saveState(component);
                }), 1000
            );
        }
    },
    
    // Handle a button click on a high-touch focus item
    handleHighTouchFocus : function(component, event, helper) {
        var buttonValue = event.getSource().get("v.value");
        var buttonLabel = event.getSource().get("v.label");
        
        // Show toast notification
        helper.showToast(component, 'Success', 'High Touch Focus: ' + buttonLabel, 'success');
        
        // Navigate to URL if specified
        var link = '';
        switch(buttonValue) {
            case '0':
                link = component.get("v.highTouch1ButtonLink");
                break;
            case '1':
                link = component.get("v.highTouch2ButtonLink");
                break;
            case '2':
                link = component.get("v.highTouch3ButtonLink");
                break;
        }
        
        if (link) {
            helper.navigateToUrl(link);
        }
    },
    
    // Handle a button click on a site visit item
    handleSiteVisit : function(component, event, helper) {
        var index = event.getSource().get("v.value");
        var title, url;
        
        if (index == 0) {
            title = component.get("v.siteVisits1Title");
            url = component.get("v.siteVisits1ButtonLink");
            
            // Show toast and navigate first
            helper.showToast("Site Visit", "Scheduling visit to: " + title, "info");
            
            // Navigate to the URL if provided
            if (url && url.trim() !== '') {
                helper.navigateToURL(url);
            }
            
            // Add a slight delay before hiding the item
            window.setTimeout(
                $A.getCallback(function() {
                    component.set("v.siteVisits1Visible", false);
                    // Save state after update
                    helper.saveState(component);
                }), 1000
            );
        } else if (index == 1) {
            title = component.get("v.siteVisits2Title");
            url = component.get("v.siteVisits2ButtonLink");
            
            // Show toast and navigate first
            helper.showToast("Site Visit", "Scheduling visit to: " + title, "info");
            
            // Navigate to the URL if provided
            if (url && url.trim() !== '') {
                helper.navigateToURL(url);
            }
            
            // Add a slight delay before hiding the item
            window.setTimeout(
                $A.getCallback(function() {
                    component.set("v.siteVisits2Visible", false);
                    // Save state after update
                    helper.saveState(component);
                }), 1000
            );
        } else if (index == 2) {
            title = component.get("v.siteVisits3Title");
            url = component.get("v.siteVisits3ButtonLink");
            
            // Show toast and navigate first
            helper.showToast("Site Visit", "Scheduling visit to: " + title, "info");
            
            // Navigate to the URL if provided
            if (url && url.trim() !== '') {
                helper.navigateToURL(url);
            }
            
            // Add a slight delay before hiding the item
            window.setTimeout(
                $A.getCallback(function() {
                    component.set("v.siteVisits3Visible", false);
                    // Save state after update
                    helper.saveState(component);
                }), 1000
            );
        }
    },
    
    // Toggle the expanded state for info details
    toggleDetail : function(component, event, helper) {
        // Prevent click from bubbling up to accordion section
        if (event && event.stopPropagation) {
            event.stopPropagation();
        }
        var value = event.getSource().get("v.value");
        var expandedAttribute = value + 'DetailExpanded';
        var currentValue = component.get("v." + expandedAttribute);
        
        // Toggle the expanded state
        component.set("v." + expandedAttribute, !currentValue);
    },
    
    // Handle accordion section toggling
    toggleSection : function(component, event, helper) {
        var clickedSection = event.currentTarget.getAttribute("data-section");
        var currentOpenSection = component.get("v.openSection");
        
        // If clicking the same section that's open, close it
        if (currentOpenSection === clickedSection) {
            component.set("v.openSection", "");
        } else {
            // Otherwise, open the clicked section (closes any other open section)
            component.set("v.openSection", clickedSection);
            
            // Always scroll to the top of the expanded section
            window.setTimeout(
                $A.getCallback(function() {
                    try {
                        var sectionElement = event.currentTarget;
                        if (sectionElement) {
                            // Get the current scroll position
                            var currentScroll = window.pageYOffset || document.documentElement.scrollTop;
                            
                            // Get the element's position relative to the document
                            var rect = sectionElement.getBoundingClientRect();
                            var elementTop = rect.top + currentScroll;
                            
                            // Scroll to the top of the section (elementTop is the top)
                            var targetScroll = elementTop - 10; // Small offset from top
                            
                            // For Salesforce mobile app, use direct scroll
                            var isSalesforceApp = window.sforce && window.sforce.one;
                            
                            if (isSalesforceApp) {
                                // Salesforce mobile app approach
                                window.scrollTo(0, targetScroll);
                            } else {
                                // Try smooth scroll for other contexts
                                if (window.scrollTo && window.scrollTo.length > 1) {
                                    window.scrollTo({
                                        top: targetScroll,
                                        behavior: 'smooth'
                                    });
                                } else {
                                    // Fallback for older browsers
                                    window.scrollTo(0, targetScroll);
                                }
                            }
                        }
                    } catch (error) {
                        console.log('Scroll error:', error);
                        // Fallback to scrollIntoView
                        try {
                            event.currentTarget.scrollIntoView({ block: 'start' });
                        } catch (fallbackError) {
                            console.log('Fallback scroll also failed:', fallbackError);
                        }
                    }
                }), 500 // Delay to ensure accordion animation starts
            );
        }
    }
})