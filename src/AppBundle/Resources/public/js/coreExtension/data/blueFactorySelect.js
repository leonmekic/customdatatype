pimcore.registerNS("pimcore.object.classes.data.blueFactorySelect");
pimcore.object.classes.data.blueFactorySelect = Class.create(pimcore.object.classes.data.select, {

    type: "blueFactorySelect",
    /**
     * define where this datatype is allowed
     */
    allowIn: {
        object: true,
        objectbrick: true,
        fieldcollection: true,
        localizedfield: true,
        classificationstore: true,
        block: true,
        encryptedField: true
    },

    initialize: function (treeNode, initData) {
        this.type = "blueFactorySelect";

        this.initData(initData);

        this.treeNode = treeNode;
    },

    getTypeName: function () {
        return t("blueFactorySelect");
    },

    getGroup: function () {
        return "BlueFactory";
    },

    getLayout: function () {

        var niceName = (this.getTypeName() ? this.getTypeName() : t(this.getType()));

        this.specificPanel = new Ext.form.FormPanel({
            title: t("specific_settings"),
            bodyStyle: "padding: 10px;",
            style: "margin: 10px 0 10px 0",
            items: [],
            defaults: {
                labelWidth: 140
            }
        });

        var indexCheckbox = new Ext.form.field.Checkbox({
            fieldLabel: t("index"),
            name: "index",
            itemId: "index",
            checked: this.datax.index,
            disabled: !in_array("index",this.availableSettingsFields),
            hidden: true
        });

        var uniqueCheckbox = new Ext.form.field.Checkbox({
            fieldLabel: t("unique"),
            name: "unique",
            itemId: "unique",
            checked: this.datax.unique,
            hidden: true
        });

        this.mandatoryCheckbox = new Ext.form.field.Checkbox({
            fieldLabel: t("mandatoryfield"),
            name: "mandatory",
            itemId: "mandatory",
            checked: this.datax.mandatory,
            disabled: !in_array("mandatory",this.availableSettingsFields) || this.isInCustomLayoutEditor()
        });

        var standardSettings = [
            {
                xtype: "textfield",
                fieldLabel: t("name"),
                name: "name",
                width: 540,
                maxLength: 70,
                itemId: "name",
                autoCreate: {tag: 'input', type: 'text', maxlength: '70', autocomplete: 'off'},
                enableKeyEvents: true,
                value: this.datax.name,
                disabled: !in_array("name", this.availableSettingsFields) || this.inCustomLayoutEditor,
                listeners: {
                    keyup: function (el) {
                        // autofill title field if untouched and empty
                        var title = el.ownerCt.getComponent("title");
                        if (title["_autooverwrite"] === true) {
                            el.ownerCt.getComponent("title").setValue(el.getValue());
                        }
                    }
                }
            },
            {
                xtype: "textfield",
                fieldLabel: t("title") + " (" + t("label") + ")",
                name: "title",
                itemId: "title",
                width: 540,
                value: this.datax.title,
                disabled: !in_array("title",this.availableSettingsFields),
                enableKeyEvents: true,
                listeners: {
                    keyup: function (el) {
                        el["_autooverwrite"] = false;
                    },
                    afterrender: function (el) {
                        if(el.getValue().length < 1) {
                            el["_autooverwrite"] = true;
                        }
                    }
                }
            },
            {
                xtype: "textfield",
                fieldLabel: t("select") + " (" + t("label") + ")",
                name: "select",
                itemId: "select",
                width: 540,
                value: this.datax.select,
                disabled: !in_array("title",this.availableSettingsFields),
                enableKeyEvents: true,
                listeners: {
                    keyup: function (el) {
                        el["_autooverwrite"] = false;
                    },
                    afterrender: function (el) {
                        if(el.getValue().length < 1) {
                            el["_autooverwrite"] = true;
                        }
                    }
                }
            },
            {
                xtype: "textarea",
                fieldLabel: t("tooltip"),
                name: "tooltip",
                width: 540,
                height: 100,
                value: this.datax.tooltip,
                disabled: !in_array("tooltip",this.availableSettingsFields)
            },
            this.mandatoryCheckbox,
            indexCheckbox,
            uniqueCheckbox,
            {
                xtype: "checkbox",
                fieldLabel: t("not_editable"),
                name: "noteditable",
                itemId: "noteditable",
                checked: this.datax.noteditable,
                disabled: !in_array("noteditable",this.availableSettingsFields)
            },
            {
                xtype: "checkbox",
                fieldLabel: t("invisible"),
                name: "invisible",
                itemId: "invisible",
                checked: this.datax.invisible,
                disabled: !in_array("invisible",this.availableSettingsFields)
            }
        ];

        if (!this.inCustomLayoutEditor) {
            standardSettings.push(            {
                xtype: "checkbox",
                fieldLabel: t("visible_in_gridview"),
                name: "visibleGridView",
                itemId: "visibleGridView",
                checked: this.datax.visibleGridView,
                disabled: !in_array("visibleGridView",this.availableSettingsFields)
            });

            standardSettings.push({
                xtype: "checkbox",
                fieldLabel: t("visible_in_searchresult"),
                name: "visibleSearch",
                itemId: "visibleSearch",
                checked: this.datax.visibleSearch,
                disabled: !in_array("visibleSearch",this.availableSettingsFields)
            });

            indexCheckbox.setHidden(false);
            if (this.datax.hasOwnProperty("unique")) {
                uniqueCheckbox.setHidden(false);
                Ext.QuickTips.init();
                Ext.QuickTips.register({target:  uniqueCheckbox, text: t("unique")});
            }
        }

        var layoutSettings = [
            {
                xtype: "textfield",
                fieldLabel: t("css_style") + " (float: left; margin:10px; ...)",
                name: "style",
                itemId: "style",
                value: this.datax.style,
                width: 740,
                disabled: !in_array("style",this.availableSettingsFields)
            }
        ];

        this.standardSettingsForm = new Ext.form.FormPanel(
            {
                bodyStyle: "padding: 10px;",
                style: "margin: 0 0 10px 0",
                defaults: {
                    labelWidth: 140
                },
                itemId: "standardSettings",
                items: standardSettings
            }
        );

        this.layoutSettingsForm = new Ext.form.FormPanel(
            {
                title: t("layout_settings"),
                bodyStyle: "padding: 10px;",
                style: "margin: 10px 0 10px 0",
                defaults: {
                    labelWidth: 230
                },
                items: layoutSettings
            }
        );


        this.layout = new Ext.Panel({
            title: '<b>' + this.datax.name + " (" + t("type") + ": " + niceName + ")</b>",
            bodyStyle: 'padding: 10px;',
            items: [
                this.standardSettingsForm,
                this.layoutSettingsForm,
                this.specificPanel
            ]
        });

        this.layout.on("render", this.layoutRendered.bind(this));

        var specificItems = this.getSpecificPanelItems(this.datax);
        this.specificPanel.add(specificItems);

        return this.layout;
    },
});