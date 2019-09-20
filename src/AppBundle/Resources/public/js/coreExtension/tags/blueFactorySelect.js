pimcore.registerNS('pimcore.object.tags.blueFactorySelect');
pimcore.object.tags.blueFactorySelect = Class.create(pimcore.object.tags.abstract, {
    type: "blueFactorySelect",

    initialize: function (data, fieldConfig) {
        this.defaultValue = null;
        this.data = {};

        if ((typeof data === "undefined" || data === null) && (fieldConfig.defaultValue)) {
            data = {
                title: "",
                select: fieldConfig.defaultValue,
            };

            this.defaultValue = data;
        }

        this.data = data;
        this.fieldConfig = fieldConfig;
    },

    getLayoutEdit: function () {
        var input = {
            fieldLabel: this.fieldConfig.title,
            name: 'title',
            componentCls: "object_field",
            labelWidth: 100
        };

        if (this.data) {
            input.value = this.data.title;
        }

        if (this.fieldConfig.width) {
            input.width = this.fieldConfig.width;
        } else {
            input.width = 250;
        }

        if (this.fieldConfig.labelWidth) {
            input.labelWidth = this.fieldConfig.labelWidth;
        }
        input.width += input.labelWidth;

        if (this.fieldConfig.columnLength) {
            input.maxLength = this.fieldConfig.columnLength;
            input.enforceMaxLength = true;
        }

        if (this.fieldConfig["regex"]) {
            input.regex = new RegExp(this.fieldConfig.regex);
        }

        this.inputComponent = new Ext.form.TextField(input);

        var validValues = [];
        var storeData = [];
        var hasHTMLContent = false;

        if (!this.fieldConfig.mandatory) {
            storeData.push({'value': '', 'key': "(" + t("empty") + ")"});
        }

        var restrictTo = null;
        if (this.fieldConfig.restrictTo && this.fieldConfig.restrictTo.length > 0) {
            restrictTo = this.fieldConfig.restrictTo.split(",");
        }

        if (this.fieldConfig.options) {
            for (var i = 0; i < this.fieldConfig.options.length; i++) {
                var value = this.fieldConfig.options[i].value;
                if (restrictTo) {
                    if (!in_array(value, restrictTo)) {
                        continue;
                    }
                }

                var label = ts(this.fieldConfig.options[i].key);
                if (label.indexOf('<') >= 0) {
                    hasHTMLContent = true;
                    label = replace_html_event_attributes(strip_tags(label, "div,span,b,strong,em,i,small,sup,sub2"));
                }

                storeData.push({'value': value, 'key': label});

                validValues.push(value);
            }
        }

        var store = Ext.create('Ext.data.Store', {
            fields: ['value', 'key'],
            data: storeData
        });


        var options = {
            name: 'select',
            triggerAction: "all",
            editable: true,
            queryMode: 'local',
            autoComplete: false,
            forceSelection: true,
            selectOnFocus: true,
            fieldLabel: this.fieldConfig.select,
            store: store,
            componentCls: "object_field",
            width: 250,
            displayField: 'key',
            valueField: 'value',
            labelWidth: 100
        };

        if (hasHTMLContent) {
            options.displayTpl = Ext.create('Ext.XTemplate',
                '<tpl for=".">',
                '{[Ext.util.Format.stripTags(values.key)]}',
                '</tpl>'
            );
        }

        if (this.fieldConfig.labelWidth) {
            options.labelWidth = this.fieldConfig.labelWidth;
        }

        if (this.fieldConfig.width) {
            options.width = this.fieldConfig.width;
        }

        if (typeof this.defaultValue == "string" || typeof this.data.select == "string") {
            if (in_array(this.defaultValue, validValues)) {
                options.value = this.defaultValue;
            } else {
                options.value = this.data.select;
            }
        } else {
            options.value = "";
        }

        options.width += options.labelWidth;

        this.selectComponent = new Ext.form.ComboBox(options);

        this.component = new Ext.form.FieldContainer({
            layout: 'form',
            margin: '0 0 10 0',
            labelWidth: options.labelWidth,
            combineErrors: false,
            items: [this.selectComponent, this.inputComponent],
            componentCls: "object_field",
            isDirty: function() {
                return this.inputComponent.isDirty() || this.selectComponent.isDirty()
            }.bind(this)
        });

        return this.component;
    },

    getValue: function () {
        this.data.select = this.selectComponent.getValue();
        this.data.title = this.inputComponent.getValue();

        return this.data;
    },
});