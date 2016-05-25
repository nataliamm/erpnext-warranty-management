frappe.listview_settings['Warranty Request'] = {
    add_fields: ["status"],

    has_indicator_for_draft: true,

    get_indicator: function(doc) {
        if(doc.docstatus==1) {
            return [__("Submitted"), "red", "docstatus,=,1"];
        }
        if(doc.status==="Start Receiving") {
            return [__("Start Receiving"), "red", "status,=,Start Receiving"];
        } else if(doc.status==="Confirmed") {
            return [__("Confirmed"), "green", "status,=,Confirmed"];
        } else if(doc.status==="Testing") {
            return [__("Testing"), "orange", "status,=,Testing"];
        } else if(doc.status==="Testing Completed") {
            return [__("Testing Completed"), "green", "status,=,Testing Completed"];
        } else if(doc.status==="Repairing") {
            return [__("Repairing"), "orange", "status,=,Repairing"];
        } else if(doc.status==="Repairing Completed") {
            return [__("Repairing Completed"), "green", "status,=,Repairing Completed"];
        }
    },
};
