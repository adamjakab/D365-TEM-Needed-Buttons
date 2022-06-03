/**
 * @author Adam Jakab <adja@queue-it.com>
 * @license MIT
 * @description TEM Needed Button Code for CRM Account Form
 * 
 * web resource: "Account - TEM Needed Button" (new_account_form_tem_needed_button)
**/

const button_text = "TEM Needed Request"
const app_id = "5ec43439-da03-40eb-99a3-723d29ccdc4f"
const tenant_id = "736baa66-510e-4ec2-8de0-710bdf0c5ccf"
const power_app_url_tpl = "https://apps.powerapps.com/play/{APPID}?tenantId={TENID}&account_id={ACCOUNTID}"
const ui_element_query = "section[data-id=\"section_tem\"]"

// Environment
const $ = parent.jQuery;

/**
 * Returns the Power App URL with the correct parameter to the account
 * @param {string} account_id 
 * @returns {string}
 */
const getPowerAppUrl = function(account_id) {
    return power_app_url_tpl.replace("{APPID}", app_id).replace("{TENID}", tenant_id).replace("{ACCOUNTID}", account_id);
}

/**
 * Returns the reference of the UI element to which the button should be appended to.
 * 
 * @returns {}
 */
const getUIAttachToElement = function() {
    let answer = false;
    const $el = $(ui_element_query);
    if ($el.length === 1) {
        answer = $el[0];
    } 
    return answer;
}

const isTemNeededButtonInjected = function(ui_el) {
    const $tnb = $("button#tem_needed_button", ui_el);
    return $tnb.length > 0;
}

const injectTemNeededButton = function(executionContext) {
    const formContext = executionContext.getFormContext();

    //If the specified UI element is not on the page/tab then bail out
    const $ui_el = getUIAttachToElement();
    if (!$ui_el) {
        return;
    }

    //TEM Needed button is already in place
    if (isTemNeededButtonInjected($ui_el)) {
        return;
    }

    //If this is a new account (not yet saved) it will not have an id - so no button will be shown
    let account_id = formContext.data.entity.getId()
    if (!account_id) {
        //console.log("NO ID!")
        return
    }
    account_id = account_id.replace(/[{}]/g, '')
    //console.log("ID:" + account_id)

    var $el_link = $("<a />").attr({
        href: getPowerAppUrl(account_id),
        target: "_blank"
    });
    //console.log("EL-LINK", $el_link);

    var $el_button = $("<button>" + button_text + "</button>").attr({
        id: "tem_needed_button",
        style: "width:100%; padding: 10px; background: #e83d0f; color: #ffffff; border-radius: 5px;"
    });
    $el_link.prepend($el_button);
    //console.log("EL-LINK", $el_link);
    
    // Add to UI (prepend/append)
    $ui_el.prepend($el_link[0]);
}

/**
 * Called by D365 on page load event
 * @param {*} executionContext 
 */
function TemNeededButtonOnLoad(executionContext) {
    const formContext = executionContext.getFormContext();
    const summaryTab = formContext.ui.tabs.get("tab_summary");
    summaryTab.addTabStateChange(injectTemNeededButton);
    injectTemNeededButton(executionContext);
}
