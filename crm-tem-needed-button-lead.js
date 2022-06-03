/**
 * @author Adam Jakab <adja@queue-it.com>
 * @license MIT
 * @description TEM Needed Button Code for CRM Lead Form
 * 
 * resource: "Lead - TEM Needed Button" (new_lead_form_tem_needed_button)
**/

const button_text = "TEM Needed Request"
const app_id = "4411e51c-e601-4c3d-9618-eac15cd1a14b"
const tenant_id = "736baa66-510e-4ec2-8de0-710bdf0c5ccf"
const power_app_url_tpl = "https://apps.powerapps.com/play/{APPID}?tenantId={TENID}&lead_id={LEADID}"
const ui_element_query = "section[data-id=\"section_tech_info\"]"

// Environment
const $ = parent.jQuery;

/**
 * Returns the Power App URL with the correct parameter to the lead
 * @param {string} lead_id 
 * @returns {string}
 */
const getPowerAppUrl = function(lead_id) {
    return power_app_url_tpl.replace("{APPID}", app_id).replace("{TENID}", tenant_id).replace("{LEADID}", lead_id);
}

/**
 * Returns the reference of the UI element to which the button should be appended to.
 * 
 * @returns {}
 */
const getUIAttachToElement = function() {
    return $(ui_element_query)[0];
}


function injectTemNeededButton(executionContext) {
    const formContext = executionContext.getFormContext()

    //If this is a new lead (not yet saved) it will not have an id - so no button will be shown
    let lead_id = formContext.data.entity.getId()
    if (!lead_id) {
        //console.log("NO ID!")
        return
    }
    lead_id = lead_id.replace(/[{}]/g, '')
    //console.log("ID:" + lead_id)

    //If there is already a linked case, the button will not be shown (cr38e_onboarding_case)
    let case_id = null;
    const fieldObject = formContext.data.entity.attributes.get("cr38e_onboarding_case");
    if (fieldObject.getValue() != null) {
        //let case_id = fieldObject.getValue()[0].id.replace(/[{}]/g, '')
        //console.log("You already have a case! ID:" + case_id)
        return
    }

    var $el_link = $("<a />").attr({
        href: getPowerAppUrl(lead_id),
        target: "_blank"
    });
    //console.log("EL-LINK", $el_link);

    var $el_button = $("<button>" + button_text + "</button>").attr({
        id: "tem_needed_button",
        style: "width:100%; padding: 10px; background: #e83d0f; color: #ffffff; border-radius: 5px;"
    });
    $el_link.prepend($el_button);
    //console.log("EL-LINK", $el_link);
    
    // Add to UI
    const el = getUIAttachToElement();
    el.prepend($el_link[0]);
}
