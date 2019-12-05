
    sap.ui.jsview("datosmaestros3.datosmaestros3.view.index", {

    /** Specifies the Controller belonging to this View. 
     * In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
     * @memberOf controller.index
     */
    getControllerName: function () {
        return "datosmaestros3.datosmaestros3.controller.index";
    },

    /** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed. 
     * Since the Controller is given to this method, its event handlers can be attached right away.
     * @memberOf controller.index
     */
    createContent: function (oController) {
        function logout() {
            $.ajax({
              "url": "/services/userapi/logout",
              "success": function() {
                location.reload()
              },
              "complete": function() {
                location.reload()
              }
            });
        }
        
    var TituloDeLaAplicacion = new sap.m.Label({
        text : "Menú Principal",
        textAlign : "Left",
        design : "Bold"
   })
    
    function isBlank (str) {
      return (!str || /^\s*$/.test(str))
    };
    function utoa(str) {
        return window.btoa(unescape(encodeURIComponent(str)));
    };
    var SERVER = '/HanaSURA2/DatosMaestrosAdmin/Maestros/service/';
    var SERVER_XSODATA = '/HanaSURA2/DatosMaestrosAdmin/Maestros/xsodata/tables.xsodata/';
    var schema = '';
    var schemas = [];
    var keys = [];
    var keysNew = [];
    var records = [];
    var tables = [];
    var table = {};
    var recordSelect = {};
    var keysInput = {};
    var keysInputEdict = {};
    var oTextUpdate = new sap.m.Text({text:''})
    var oTextCreate = new sap.m.Text({text:''})
    var oTextCreateError = new sap.m.Text({text:''})
    var isLoad = false
    var oDialogoErro = new sap.m.Dialog(
      {title: 'Error', icon:'sap-icon://error'}
    ).addButton( new sap.m.Button({text: "Cerrar"}).attachPress(function(argument) {
      oDialogoErro.close()
    })
    ).addContent(new sap.m.Text({text:' Debe seleccionar al menos un registro para poder actualizar o eliminar. '}))
    
    var oDialogoHelp = new sap.m.Dialog(
      {title: 'Nuevo Registro Help', icon:'sap-icon://help'}
    ).addButton( new sap.m.Button({text: "Cerrar"}).attachPress(function(argument) {
      oDialogoHelp.close()
    })
    ).addContent(new sap.m.Image({src: 'img/ayuda_crear.png'}))
    
    var oDialogoHelpFull = new sap.m.Dialog(
      {title: 'Help', icon:'sap-icon://help'}
    ).addButton( new sap.m.Button({text: "Cerrar"}).attachPress(function(argument) {
      oDialogoHelpFull.close()
    })
    ).addContent(new sap.m.Image({src: 'img/ayuda_full.png'}))

    var oDialogoConfirm = new sap.m.Dialog(
      {title: 'Confirmación', icon:'sap-icon://delete'}
    ).addButton( new sap.m.Button({text: "Aceptar", type: sap.m.ButtonType.Accept}).attachPress(function(argument) {
      deleteRecords(false)
      oDialogoConfirm.close()
    })).addButton( new sap.m.Button({text: "Cerrar"}).attachPress(function(argument) {
      oDialogoConfirm.close()
    })).addContent(new sap.m.Text({text:' ¿Está seguro de eliminar los registros seleccionados?. '}))
    
    var oDialogoSuccessUpload = new sap.m.Dialog(
      {title: 'Actualizado', icon:'sap-icon://save'}
    ).addButton( new sap.m.Button({text: "Cerrar"}).attachPress(function(argument) {
      oDialogoSuccessUpload.close()
    })
    ).addContent(oTextUpdate)
    
    var oDialogoSuccessCreate = new sap.m.Dialog(
      {title: 'Creado', icon:'sap-icon://add'}
    ).addButton( new sap.m.Button({text: "Cerrar"}).attachPress(function(argument) {
      oDialogoSuccessCreate.close()
    })
    ).addContent(oTextCreate)
    
    var oDialogoErroCantAccion = new sap.m.Dialog(
      {title: 'Error', icon:'sap-icon://error'}
    ).addButton( new sap.m.Button({text: "Cerrar"}).attachPress(function(argument) {
      oDialogoErroCantAccion.close()
    })
    ).addContent(oTextCreateError)
    
    var oDialogoErroSelectSchemaTableUser = new sap.m.Dialog(
      {title: 'Error', icon:'sap-icon://error'}
    ).addButton( new sap.m.Button({text: "Cerrar"}).attachPress(function(argument) {
      oDialogoErroSelectSchemaTableUser.close()
    })
    ).addContent(new sap.m.Text({text:' Debe seleccionar un esquema, tabla y usuario para agregar o actualizar permisos. '}))
    
    var oTable = new sap.ui.table.Table();
    var oTableNew = new sap.ui.table.Table();
    var oGridinputbottom = new sap.ui.layout.Grid({defaultSpan:"L1 M2 S2"});
    var nameTableInput = new sap.m.Input();
    var nameTableLabel = new sap.ui.commons.Label({text: "Nombre de la Tabla"}).setLabelFor(nameTableInput);
    var canUpdate = new sap.m.CheckBox({text:"Se Pueden Editar los Registros"});
    var canDelete = new sap.m.CheckBox({text:"Se Pueden Eliminar los Registros"});
    var canAdd = new sap.m.CheckBox({text:"Se Pueden Agregar los Registros"});
    var oGridBeforeHeader = new sap.ui.layout.Grid('oGridBeforeHeader',{defaultSpan:"L12 M12 S12"});
    var oGridIndexBody = new sap.ui.layout.Grid('oGridIndexBody',{defaultSpan:"L12 M12 S12"});
    var oGridBodyFull = new sap.ui.layout.Grid({defaultSpan:"L12 M12 S12"});
    var oGridinputCheckBox = new sap.ui.layout.Grid({defaultSpan:"L4 M6 S12"});
    var oButtonAddOUpdate = new sap.m.Button({text: "Agregar o Actualizar Permisos", type: sap.m.ButtonType.Accept});
    oButtonAddOUpdate.attachPress({}, function() {
      addOUpdatePermiso()
    });
    var oCheckBoxAddRecord = new sap.m.CheckBox({text: "Puede Agregar"});
    var oCheckBoxUpdateRecord = new sap.m.CheckBox({text: "Puede Actualizar"});
    var oCheckBoxDeleteRecord = new sap.m.CheckBox({text: "Puede Eliminar"});
    var oGridHeader = new sap.ui.layout.Grid('oGridHeader',{defaultSpan:"L6 M6 S12"});
    var oGridBody = new sap.ui.layout.Grid('oGridBody',{defaultSpan:"L12 M12 S12"});
    var oGridBottonEdit = new sap.ui.layout.Grid({defaultSpan:"L6 M6 S12"});
    var oTableUserName =  new sap.m.Text()
    var oTextDeleteRecord =  new sap.m.Text({text:''})
    var oTextUpdateRecord =  new sap.m.Text({text:''})

    var user = {};
    var isAdmin = false;
    var UserTables = [];
    var oInputSimpleTable = new sap.m.Select("seleteSimpleTable", {name: "Table"});
    var oInputSimpleTableLabel = new sap.ui.commons.Label({text: "Tabla"}).setLabelFor(oInputSimpleTable);
    var itemSelectSimpleTable = new sap.ui.core.Item({key: "0", text: "Seleccione una Tabla"});
    oInputSimpleTable.attachChange({}, function() {
        if (oInputSimpleTable.getSelectedItem().getKey() !== '0') {
            tables.map(function(tableSimple) {
              if (String(tableSimple.ID) === oInputSimpleTable.getSelectedItem().getKey()) {
                table = tableSimple
                getKeysTables(tableSimple, false)
                oGridBody.removeAllContent()
              }
            })
        } else {
          oGridBody.removeAllContent()
        }
    });
    var oButtonDeleteRecordUserPermisie = new sap.m.Button({icon:'sap-icon://delete'});
    oButtonDeleteRecordUserPermisie.attachPress({}, function() {
      deleteRecords(true)
    });   
    var oBarNewTable = new sap.m.Bar( {
        contentLeft : [new sap.m.Button({icon: 'sap-icon://sys-help'}).attachPress(function(argument) {
          oDialogoErroSelectSchemaTableUser.close()
        }) ],
       contentMiddle : [ oTableUserName ],
       contentRight : [oButtonDeleteRecordUserPermisie]
    });
    var oTableUserTables = new sap.ui.table.Table({
        title: oBarNewTable,                                   // Displayed as the heading of the table
        enableColumnReordering:true,       // Allows you to drag and drop the column and reorder the position of the column
        width:"100%"                              // width of the table
      }).addColumn(new sap.ui.table.Column({
          width: "350px",
          label: new sap.m.Label({text: "Usuarios"}),             // Creates an Header with value defined for the text attribute
          template: new sap.m.Text().bindProperty("text", "USER"), // binds the value into the text field defined using JSON
          sortProperty: "USER",        // enables sorting on the column
          filterProperty: "USER",       // enables set filter on the column
        })).addColumn(new sap.ui.table.Column({
            width: "200px",
          label: new sap.m.Label({text: "Nombre de Esquema"}),             // Creates an Header with value defined for the text attribute
          template: new sap.m.Text().bindProperty("text", "SCHEMA_NAME"), // binds the value into the text field defined using JSON
          sortProperty: "SCHEMA_NAME",        // enables sorting on the column
          filterProperty: "SCHEMA_NAME",       // enables set filter on the column
        })).addColumn(new sap.ui.table.Column({
            width: "200px",
          label: new sap.ui.commons.Label({text: "Nombre de Tabla"}),             // Creates an Header with value defined for the text attribute
          template: new sap.m.Text().bindProperty("text", "LABEL"), // binds the value into the text field defined using JSON
          sortProperty: "LABEL",        // enables sorting on the column
          filterProperty: "LABEL",       // enables set filter on the column
        })).addColumn(new sap.ui.table.Column({
            width: "110px",
          label: new sap.m.Label({text: "Puede Aregar"}),             // Creates an Header with value defined for the text attribute
          template: new sap.m.Text().bindProperty("text", "CAN_ADD"), // binds the value into the text field defined using JSON
          sortProperty: "CAN_ADD",        // enables sorting on the column
          filterProperty: "CAN_ADD",       // enables set filter on the column
        })).addColumn(new sap.ui.table.Column({
            width: "125px",
          label: new sap.m.Label({text: "Puede Actualizar"}),             // Creates an Header with value defined for the text attribute
          template: new sap.m.Text().bindProperty("text", "CAN_UPDATE"), // binds the value into the text field defined using JSON
          sortProperty: "CAN_UPDATE",        // enables sorting on the column
          filterProperty: "CAN_UPDATE",       // enables set filter on the column
        })).addColumn(new sap.ui.table.Column({
            width: "120px",
          label: new sap.m.Label({text: "Puede Eliminar"}),             // Creates an Header with value defined for the text attribute
          template: new sap.m.Text().bindProperty("text", "CAN_DELETE"), // binds the value into the text field defined using JSON
          sortProperty: "CAN_DELETE",        // enables sorting on the column
          filterProperty: "CAN_DELETE",       // enables set filter on the column
        }));

    function createdSelectSimpleTable(data) {
        oInputSimpleTable.removeAllItems();
        oSideBar.destroyItems()
        oInputSimpleTable.addItem(itemSelectSimpleTable);
        data.map(function(item){
            oInputSimpleTable.addItem(new sap.ui.core.Item({key: item.ID, text: item.SCHEMA_NAME + ': ' + ((item.LABEL && !isBlank(item.LABEL)) && item.LABEL != 'null' ? item.LABEL : item.NAME )}));
            oSideBar.addItem(new sap.ui.core.Item({key: item.ID, text: item.SCHEMA_NAME + ': ' + ((item.LABEL && !isBlank(item.LABEL)) && item.LABEL != 'null' ? item.LABEL : item.NAME )}))
        })
    };
    function getUser(){
        oGridHeader.removeAllContent();
        oGridBody.removeAllContent();
        $.ajax({
          "url": "/services/userapi/currentUser",
          "success": function(data) {
            user = data
            getAdminStar(data)
          },
          "complete": function() {
            //location.reload()
          }
        });
    };
    function getAdmin(userQ){
        $.ajax({
          "url": SERVER + "getUserPermise.xsjs/?username="+userQ.name.toUpperCase(),
          "success": function(data) {
            responseJson = JSON.parse(data);
            TituloDeLaAplicacion.setText("Administrador de Datos Maestros")
            OFullConten.setShowSideContent( true )
            oButtonTogglesSideBar.setText('Ocultar Tablas' )
            oBar.removeAllContentLeft()
            oBar.addContentLeft(oButtonBack)
            oBar.addContentLeft(oButtonTogglesSideBar)
            tables = responseJson.records
            oGridBeforeHeader.removeAllContent()
            oGridHeader.removeAllContent();
            oGridBody.removeAllContent();
            createdSelectSimpleTable(responseJson.records);
            isAdmin = responseJson.isAdmin;
            oInputSimpleTable.setSelectedKey('0')
            oGridIndexBody.removeAllContent()
          },
          "error": function(){
            logout()
          },
          "complete": function() {
            //location.reload()
          }
        });
    };

    function getAdminStar(userQ){
        $.ajax({
            headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          "url": SERVER + "getUserPermise.xsjs/?username="+userQ.name.toUpperCase(),
          "success": function(data) {
            isAdmin = JSON.parse(data).isAdmin;
            if (isAdmin) {
                BodyInt()
                oButtonUserPermises.setEnabled(true)
                oButtonPermisosEtl.setEnabled(true)
                oButtonDatosMaestros.setEnabled(true)
                oButtonValidacionesDeCarga.setEnabled(true)
            } else {
                monitoreView()
            }
          },
          "complete": function() {
            //location.reload()
          }
        });
    };
    function addOUpdatePermiso(){
      if (oInputSchema.getSelectedItem().getKey() !== '0' && oInput.getSelectedItem().getKey() !== '0' && !isBlank(oSearchField.getValue())) {
        $.ajax({
          "url": SERVER + "updatePermise.xsjs/",
          contentType: "application/json; charset=utf-8",
          dataType: "json",
          type: "POST",
          "data": JSON.stringify({
            user: oSearchField.getValue().toUpperCase(),
            schema: oInputSchema.getSelectedItem().getKey(),
            table: oInput.getSelectedItem().getKey(),
            canDelete: oCheckBoxDeleteRecord.getSelected() ? 'SI' : 'NO',
            canAdd: oCheckBoxAddRecord.getSelected() ? 'SI' : 'NO',
            canUpdate: oCheckBoxUpdateRecord.getSelected() ? 'SI' : 'NO',
          }),
          "success": function(data) {
            var responseJson = {}
            if (typeof(data) == 'String') {
              responseJson = JSON.parse(data);
            } else {
              responseJson = data  
            }
            getUserTablesQuery(oSearchField.getValue());
            oInputSchema.setSelectedKey('0')
            oInput.setSelectedKey('0')
            createdSelect([])
          },
          "error": function(){
            logout()
          },
          "complete": function() {
            //location.reload()
          }
        });
      } else {
        oDialogoErroSelectSchemaTableUser.open()
      }
    };
    function getUserTablesQuery(userQ){
        $.ajax({
          "url": SERVER + (isBlank(userQ) ? 'getUserPermise.xsjs/?username=ALL' : "getUserPermise.xsjs/?username="+userQ.toUpperCase()),
          "success": function(data) {
            responseJson = JSON.parse(data);
            oGridBody.removeAllContent()
            oGridBody.addContent(oTableUserTables)
            var oModel = new sap.ui.model.json.JSONModel();        // created a JSON model      

            oModel.setData({modelData: responseJson.records});                              // Set the data to the model using the JSON object defined already

            oTableUserTables.setModel(oModel);                                                                                  

            oTableUserTables.bindRows("/modelData");
          },
          "error": function(){
            logout()
          },
          "complete": function() {
            //location.reload()
          }
        });
    }
    getUser()
    var oSearchField = new sap.m.SearchField({placeholder: "Usuario"}).attachSearch(function(event, data) {
      if (TituloDeLaAplicacion.getText() != 'Administrador de Permisos Datos Maestros') {
          getFilialByUser(oSearchField.getValue()); 
      } else {
          getUserTablesQuery(oSearchField.getValue());
          oTableUserName.setText('Permisos Del Usuario: ' + oSearchField.getValue().toUpperCase() )
      }
      //getUserPermise(user)
    });
    function AddUserScream() {
      TituloDeLaAplicacion.setText("Administrador de Permisos Datos Maestros")
      oGridBeforeHeader.removeAllContent()
      oGridHeader.removeAllContent()
      oGridBody.removeAllContent()
      oGridinputCheckBox.removeAllContent()
      getSchema()
      oGridBeforeHeader.addContent(oSearchField)
      oGridHeader.addContent(oGridinputSchema)
      oGridHeader.addContent(oGridinput)
      oGridHeader.addContent(oGridinputCheckBox)
      oInput.setSelectedKey('0')
      oInputSchema.setSelectedKey('0')
      oBar.removeAllContentLeft()
      oBar.addContentLeft(oButtonBack)
      getUserTablesQuery('')
      oGridIndexBody.removeAllContent()
    }
    // Input Table
    var oInput = new sap.m.Select("seleteTable", {name: "Table", width: "100%"})
    var oInputLabel = new sap.ui.commons.Label({text: "Tabla"}).setLabelFor(oInput)
    var itemSelectTable = new sap.ui.core.Item({key: "0", text: "Seleccione una Tabla"})
    oInput.attachChange({}, function() {
        if (oInput.getSelectedItem().getKey() !== '0') {
            tables.map(function(tableSimple) {
              if (tableSimple.NAME === oInput.getSelectedItem().getKey()) {
                table = {...tableSimple, "SCHEMA_NAME": schema}
                getKeysTables({...tableSimple, "SCHEMA_NAME": schema}, true)
              }
            })
        }
    });
    function createdSelect(data) {
        oInput.removeAllItems()
        oInput.addItem(itemSelectTable);
        data.map(function(item){
            oInput.addItem(new sap.ui.core.Item({key: item.NAME, text: item.LABEL && !isBlank(item.LABEL) && item.LABEL != 'null' ? item.LABEL : item.NAME }));
        })
    }
    var oGridinput = new sap.ui.layout.Grid({defaultSpan:"L12 M12 S12"}).addContent(oInputLabel).addContent(oInput)
    function getTables(){
        $.ajax({
          "url": SERVER+'getTables.xsjs/?schema='+schema,
          "success": function(data) {
            responseJson = JSON.parse(data);
            createdSelect(responseJson)
            tables = responseJson
          },
          "error": function(){
            logout()
          },
          "complete": function() {
            //location.reload()
          }
        });
    }
    // Input Schema
    var oInputSchema = new sap.m.Select("seleteSchema", {name: "Esquema", width: "100%"})
    var oInputSchemaLabel = new sap.ui.commons.Label({text: "Esquema"}).setLabelFor(oInputSchema)
    oInputSchema.attachChange({}, function() {
      oInput.setSelectedKey('N')
      if (oInputSchema.getSelectedItem().getKey() !== '0') {
          schema = oInputSchema.getSelectedItem().getKey()
          getTables()
      }
    });
    function createdSelectSchema(data) {
        oInputSchema.removeAllItems()
        oInputSchema.addItem(itemSelectSchema);
        data.map(function(item){
            oInputSchema.addItem(new sap.ui.core.Item({key: item, text: item}));
        })
    }
    var itemSelectSchema = new sap.ui.core.Item({key: "0", text: "Seleccione un Esquema"})
    var oGridinputSchema = new sap.ui.layout.Grid({defaultSpan:"L12 M12 S12"}).addContent(oInputSchemaLabel).addContent(oInputSchema)
    function getSchema(){
        $.ajax({
          "url": SERVER+'getSchema.xsjs',
          "success": function(data) {
            responseJson = JSON.parse(data);
            createdSelectSchema(responseJson)
            createdSelect([])
            schemas = responseJson
          },
          "error": function(){
            logout()
          },
          "complete": function() {
            //location.reload()
          }
        });
    }
    


    var deleteButton = new sap.m.Button({text: "Remover tabla de dato maestro", width: "100%"}).attachPress({}, function (argument) {
      if (oInput.getSelectedItem().getKey() !== '0') {
        removeTable(oInput.getSelectedItem().getKey())
      }
    })

    //Create Table
    function createdTable(table, data) {
        var dicc = {}
        table.visibleKeys.map(function (key){
          dicc[key.name] = ''
        })
        var newRecordRT = [dicc]
        oTable.destroy()
        oGridBody.removeAllContent()
        var oBarTable = new sap.m.Bar( {
            contentLeft : [new sap.m.Button({icon: 'sap-icon://sys-help'}).attachPress(function(argument) {
              oDialogoHelpFull.open()
            }) ],
           contentMiddle : [ new sap.m.Text({text: table.LABEL}) ],
           contentRight : [],
           translucent: true
        });
        oTable = new sap.ui.table.Table({
            title: oBarTable,                                   // Displayed as the heading of the table
            footer: "Total Registros: " + data.length,                                   // Displayed as the heading of the table
            showColumnVisibilityMenu: true,
            selectionMode: (String(table.CAN_UPDATE) === 'NO' && String(table.CAN_DELETE) === 'NO') ? sap.ui.table.SelectionMode.None : sap.ui.table.SelectionMode.MultiToggle,                                   // Displayed as the heading of the table
            enableColumnReordering:true,       // Allows you to drag and drop the column and reorder the position of the column
            width:"100%"                              // width of the table
          });
        table.visibleKeys.map(function(visibleKey){
          oTable.addColumn(new sap.ui.table.Column({
              width: "125px",
            label: new sap.ui.commons.Label({text: visibleKey.label ? visibleKey.label : visibleKey.name, icon: table.PKS.indexOf(visibleKey.name) > -1 ? 'sap-icon://key' : ''}),             // Creates an Header with value defined for the text attribute
            template: String(table.CAN_UPDATE) === 'SI' && table.PKS.indexOf(visibleKey.name) == -1 ? new sap.ui.commons.TextField().bindProperty("value", visibleKey.name) : new sap.m.Text().bindProperty("text", visibleKey.name), // binds the value into the text field defined using JSON
            sortProperty: visibleKey.name,        // enables sorting on the column
            filterProperty: visibleKey.name,       // enables set filter on the column
          }));
        })

        var oModel = new sap.ui.model.json.JSONModel();        // created a JSON model      

        oModel.setData({modelData: data});                              // Set the data to the model using the JSON object defined already

        oTable.setModel(oModel);                                                                                  

        oTable.bindRows("/modelData");                              // binding all the rows into the model

        oTable.sort(oTable.getColumns()[0]);

        oTableNew.destroy()
        var oBarNewTable = new sap.m.Bar( {
            contentLeft : [new sap.m.Button({icon: 'sap-icon://sys-help'}).attachPress(function(argument) {
              oDialogoHelp.open()
            }) ],
           contentMiddle : [ new sap.m.Text({text: "Nuevo Registro"}) ],
           contentRight : [],
           translucent: true
        });
        oTableNew = new sap.ui.table.Table({
            title: oBarNewTable,                                   // Displayed as the heading of the table
            selectionMode: 'None',
            visibleRowCount: 1,
            enableColumnReordering:true,       // Allows you to drag and drop the column and reorder the position of the column
            width:"100%"                              // width of the table
          });
        table.visibleKeys.map(function(visibleKey, index){
          oTableNew.addColumn(new sap.ui.table.Column({
              width: "125px",
            label: new sap.ui.commons.Label({text: visibleKey.label, icon: table.PKS.indexOf(visibleKey.name) > -1 ? 'sap-icon://key' : ''}),             // Creates an Header with value defined for the text attribute
            template: new sap.ui.commons.TextField().bindProperty("value", visibleKey.name), // binds the value into the text field defined using JSON
            sortProperty: visibleKey.name,        // enables sorting on the column
            filterProperty: visibleKey.name,       // enables set filter on the column
          }));
        })

        var oModel = new sap.ui.model.json.JSONModel();        // created a JSON model      

        oModel.setData({modelData: newRecordRT});                              // Set the data to the model using the JSON object defined already

        oTableNew.setModel(oModel);                                                                                  

        oTableNew.bindRows("/modelData");                              // binding all the rows into the model

        if (String(table.CAN_ADD) === 'SI') {
          oGridBody.addContent(oTableNew)
        }
        var oButtonAddRecord = new sap.m.Button({icon:'sap-icon://add'});
        oButtonAddRecord.attachPress({}, function() {
          createDataMaster()
        });
        oGridinputbottom.removeAllContent()
        if (String(table.CAN_ADD) === 'SI') {
          oBarNewTable.addContentRight(oButtonAddRecord)
        }
        oGridBody.addContent(oTable)
        var oButtonDeleteRecord = new sap.m.Button({icon:'sap-icon://delete'});
        oButtonDeleteRecord.attachPress({}, function() {
          var arrayIndex = oTable.getSelectedIndices()
          if (arrayIndex.length > 0) {
            oDialogoConfirm.open()
          } else {
            oDialogoErro.open()
          }          
        });
        var oButtonUpdateRecord = new sap.m.Button({icon:'sap-icon://save'});
        oButtonUpdateRecord.attachPress({}, function() {
          updateRecords()
        });
        if (String(table.CAN_UPDATE) === 'SI') {
          oBarTable.addContentRight(oButtonUpdateRecord)
        }
        if (String(table.CAN_DELETE) === 'SI') {
          oBarTable.addContentRight(oButtonDeleteRecord)
        }
        oGridBody.addContent(oGridinputbottom)
    }

    function getKeysTables(table, needRecords){
        $.ajax({
          contentType: "application/json; charset=utf-8",
          dataType: "json",
          type: "POST",
          "url": SERVER+'queryAnyTable.xsjs/',
          "data": JSON.stringify({
            table: table.NAME,
            schema: table.SCHEMA_NAME,
            noNeedRecords: needRecords 
          }),
          "success": function(data) {
            var responseJson = {}
            if (typeof(data) == 'String') {
              responseJson = JSON.parse(data);
            } else {
              responseJson = data  
            }
            table = {...table, visibleKeys: responseJson.keys, privilege: responseJson.privilege} 
            if (!needRecords) {
              createdTable(table, responseJson.records)
            } else {
              oGridinputCheckBox.removeAllContent()
              oGridHeader.addContent(oButtonAddOUpdate)
              if (table.privilege.indexOf('INSERT') > -1) {
                oGridinputCheckBox.addContent(oCheckBoxAddRecord)
              }
              if (table.privilege.indexOf('UPDATE') > -1) {
                oGridinputCheckBox.addContent(oCheckBoxUpdateRecord)
              }
              if (table.privilege.indexOf('DELETE') > -1) {
                oGridinputCheckBox.addContent(oCheckBoxDeleteRecord)
              }

            }
            keys = responseJson.keys
            records = responseJson.records
          },
          "error": function(){
            logout()
          },
          "complete": function() {
            //location.reload()
          }
        });
    }

    function getKeysNewTables(){
      $.ajax({
          "url": SERVER+'getAnyTableKeys.xsjs/',
          contentType: "application/json; charset=utf-8",
          dataType: "json",
          type: "POST",
          "data": JSON.stringify({
            table: inputNAME.getValue(),
            schema 
          }),
          "success": function(data) {
            var responseJson = {}
            if (typeof(data) == 'String') {
              responseJson = JSON.parse(data);
            } else {
              responseJson = data  
            }
            if (!responseJson.error) {
              keysNew = responseJson.keys
              createdNewTableKeys(responseJson.keys)
            } else {
              alert(responseJson.message)
            }
          },
          "error": function(){
            logout()
          },
          "complete": function() {
            //location.reload()
          }
        });
    }

    function deleteRecords(isRecords){
        var arrayIndex = isRecords ? oTableUserTables.getSelectedIndices() : oTable.getSelectedIndices()
        if (arrayIndex.length > 0) {
          var values = []
          arrayIndex.map(function(indexRow) {
            var keysForDelete = getKeysTablesFromRows(indexRow, (isRecords ? oTableUserTables : oTable))
            keysForDelete.map(function(keyForDelete) {
              if (keyForDelete.name === table.PK || (isRecords && keyForDelete.name === 'ID')) {
                values.push(keyForDelete.value)
              }
            })
            if (true) {

              $.ajax({
                  "url": SERVER+'deleteAnyTableNew.xsjs/',
                  contentType: "application/json; charset=utf-8",
                  dataType: "json",
                  type: "POST",
                  "data": JSON.stringify({
                    pk: {name: isRecords ? 'ID' : table.PK, value: values},
                    keys: keysForDelete,
                    table: isRecords ? 'TABLES' : table.NAME,
                    schema: isRecords ? 'DATO_MAESTRO_ADMIN' : table.SCHEMA_NAME 
                  }),
                  "success": function(data) {
                    var responseJson = {}
                    if (typeof(data) == 'String') {
                      responseJson = JSON.parse(data);
                    } else {
                      responseJson = data  
                    }
                    if (responseJson.error) {
                      oTextCreateError.setText('Los registros no se actualizaron por el siguiente error: ' + responseJson.TrueMessage.es)
                      oDialogoErroCantAccion.open()
                    } else {
                      if (isRecords) {
                        getUserTablesQuery(oSearchField.getValue());
                      } else {
                        getKeysTables(table, false)
                      }
                    }
                  },
                  "error": function(){
                    logout()
                  },
                  "complete": function() {
                    //location.reload()
                  }
                });
            }
          })
        } else {
          oDialogoErro.open()
        }
    }

    function updateRecords(){
      var arrayIndex = oTable.getSelectedIndices()
      var updateRecords = 0
      var failUpdateRecords = 0
      var ErrorList = []
      if (arrayIndex.length > 0) {
        arrayIndex.map(function(indexRow, index) {
          var pk = ''
          var keysForDelete = getKeysTablesFromRows(indexRow, oTable)
          keysForDelete.map(function(keyForDelete) {
            if (keyForDelete.name === table.PK) {
              pk=keyForDelete.value
            }
          })
          $.ajax({
            "url": SERVER+'updateAnyTable.xsjs/',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            type: "POST",
            "data": JSON.stringify({
              keys: keysForDelete,
              pk: {name:table.PK, value: pk},
              table: table.NAME,
              schema: table.SCHEMA_NAME 
            }),
            "success": function(data) {
              var responseJson = {}
              if (typeof(data) == 'String') {
                responseJson = JSON.parse(data);
              } else {
                responseJson = data  
              }
              if (responseJson.error) {
                failUpdateRecords = failUpdateRecords + 1
                ErrorList.push({...responseJson, keysForDelete, pk})
              } else {
                updateRecords = updateRecords + 1
              }
              if ((index + 1) == (arrayIndex.length)) {
                var finalText = 'Registros actualizados: ' + updateRecords + ', falló registros actualizados: ' + failUpdateRecords + ' ';
                ErrorList.map(function(item, index) {
                  finalText = finalText + " \n " + "El registro con el "+table.PK+": " + item.pk + ", no se pudo actualizar por: " + item.TrueMessage.es;
                })
                oTextUpdate.setText(finalText)
                oDialogoSuccessUpload.open()
                getKeysTables(table, false)
              }
            },
            "error": function(){
              logout()
            },
            "complete": function() {
              //location.reload()
            }
          });
        })
      } else {
        oDialogoErro.open()
      }
    }

    function getKeysTablesFromRows(indexRow, tableSAP) {
        var cells
        try {
          cells = tableSAP.getModel().oData.modelData[tableSAP.getModel().aBindings[tableSAP.getModel().aBindings.length-1].aIndices[indexRow]]
        }
        catch(err) {
          cells = tableSAP.getModel().oData.modelData[tableSAP.getModel().aBindings[0].aIndices[indexRow]]
        }
            var keysNewRecord = []
      Object.keys(cells).map(function(cell) {
        if (!isBlank(cells[cell])) {
          keysNewRecord.push({
            name: cell,
            value: cells[cell]
          })
        }
      })
      return keysNewRecord
    }

    function getKeysTablesFromRowsText(indexRow, tableSAP) {
      try {
          return tableSAP.getModel().oData.modelData[tableSAP.getModel().aBindings[tableSAP.getModel().aBindings.length-1].aIndices[indexRow]]
        }
        catch(err) {
          return tableSAP.getModel().oData.modelData[tableSAP.getModel().aBindings[0].aIndices[indexRow]]
        }
    }

    function createDataMaster() {
      $.ajax({
        "url": SERVER+'insertAnyTable.xsjs/',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        type: "POST",
        "data": JSON.stringify({
          keys: getKeysTablesFromRows(0, oTableNew),
          name: table.NAME,
          schema: table.SCHEMA_NAME 
        }),
        "success": function(data) {
          var responseJson = {}
          if (typeof(data) == 'String') {
            responseJson = JSON.parse(data);
          } else {
            responseJson = data  
          }
          if (responseJson.error) {
            oTextCreateError.setText('El registro no se pudo crear por: ' + responseJson.TrueMessage.es)
            oDialogoErroCantAccion.open()
          } else {
            oTextCreate.setText(' Registros Creados ')
            oDialogoSuccessCreate.open()
            getKeysTables(table, false)
          }
        },
        "error": function(){
          logout()
        },
        "complete": function() {
          //location.reload()
        }
      });
    }
    /*
      getSchema()
      oGridHeader.addContent(oGridinputSchema)
      oGridHeader.addContent(oGridinput)
    */
    var oButtonTogglesSideBar = new sap.m.Button({icon:'sap-icon://menu2', text: 'Ocultal Tablas'}).attachPress({}, function() {
      var open = OFullConten.getShowSideContent()
      OFullConten.setShowSideContent( !open )
      oButtonTogglesSideBar.setText(open ? 'Mostrar Tablas' : 'Ocultar Tablas' )
    });
    var oButtonBack = new sap.m.Button({icon:'sap-icon://close-command-field'}).attachPress({}, function() {
      BodyInt()
    });
    var oBar = new sap.m.Bar( 'barraPrincipal', {
       contentLeft : [],
       contentMiddle : [ TituloDeLaAplicacion ],
       contentRight : [new sap.ui.commons.Image( {
        src : "https://www.epssura.com/images/logo_sura.png",
        height : "45px"
       })]
    });
    var oSideBar = new sap.m.SelectList().attachSelectionChange({}, function() {
        if (oSideBar.getSelectedItem().getKey() !== '0') {
            tables.map(function(tableSimple) {
              if (String(tableSimple.ID) === oSideBar.getSelectedItem().getKey()) {
                table = tableSimple
                getKeysTables(tableSimple, false)
                oGridBody.removeAllContent()
                OFullConten.setShowSideContent( false )
                oButtonTogglesSideBar.setText('Mostrar Tablas')
              }
            })
        } else {
          oGridBody.removeAllContent()
        }
    })
    const SERVER_MONITOR = '/HanaSURA2/DatosMaestrosAdmin/monitor/';
var oInputFlowgraph = new sap.m.Select("seleteFlowgraph", {name: "Flowgraph", width: "100%"})
var itemSelect = new sap.ui.core.Item({key: "0", text: "Seleccione una ETL"});
oInputFlowgraph.attachChange({}, function() {
    if (oInputFlowgraph.getSelectedItem().getKey() !== '0') {
        getJustLogs(oInputFlowgraph.getSelectedItem().getKey())
      if (TituloDeLaAplicacion.getText() == 'Validaciones ETL') {
          getFilialByUser(oSearchField.getValue()); 
      }
    }

});
var oInputFilial = new sap.m.Select("oInputFilial", {name: "Filial", width: "100%"})
var itemSelectFilial = new sap.ui.core.Item({key: "0", text: "Selecione una filial"});
var oInputSubFilia = new sap.m.Select("oInputSubFilia", {name: "Filial", width: "100%"})
var itemSelectSubFilia = new sap.ui.core.Item({key: "0", text: "Seleccione una Compañía"});
oInputSubFilia.addItem(itemSelectSubFilia);


oInputSubFilia.attachChange({}, function() {
  if (oInputSubFilia.getSelectedItem().getKey() !== '0' && isLoad) {
      getFlowgraphPorFilial(oInputSubFilia.getSelectedItem().getKey())
  }
});
function getFilial() {
    oInputFilial.removeAllItems()
    oInputFilial.addItem(itemSelectFilial);
    $.get(SERVER_MONITOR+"filial.xsjs",function(result){
    
      JSON.parse(result).records.map(function(item){
        oInputFilial.addItem(new sap.ui.core.Item({key: item.ID_FILIAL, text: item.NAME }));
      })
    });
}
function getSubFilial(filial) {
    oInputSubFilia.removeAllItems()
    oInputSubFilia.addItem(itemSelectSubFilia);
    $.get(SERVER_MONITOR+"sub_filial.xsjs?filial="+filial,function(result){
      JSON.parse(result).records.map(function(item){
        oInputSubFilia.addItem(new sap.ui.core.Item({key: item.ID_SUB_FILIAL, text: item.NAME }));
      })
    });
}

oInputFilial.attachChange({}, function() {
    if (oInputFlowgraph.getSelectedItem().getKey() !== '0') {
        getJustLogs(oInputFlowgraph.getSelectedItem().getKey())
    }
    if (oInputFilial.getSelectedItem().getKey() !== '0') {
        getSubFilial(oInputFilial.getSelectedItem().getKey())
    }
});

function monitoreView() {
    fillTableUploadDate([])
    getFilialByUser(user.name.toUpperCase(), true)
    isLoad = true
    oInputFlowgraph.removeAllItems()
    oInputFlowgraph.addItem(itemSelect);
    TituloDeLaAplicacion.setText("Carga ETL SIC")
    oGridBeforeHeader.removeAllContent()
    oGridHeader.removeAllContent()
    oGridBody.removeAllContent()
    oGridinputCheckBox.removeAllContent()
    oGridHeader.addContent(oInputSubFilia)
    oGridHeader.addContent(oInputFlowgraph)
    oGridHeader.addContent(ejecutarBotton)
    oGridBody.removeAllContent()
    if (isAdmin) {
        oBar.addContentLeft(oButtonBack)
    }
    oGridIndexBody.removeAllContent()
    oGridBody.addContent(oTableLogs)
    oGridBody.addContent(oTableUploadRecords)
    oInputFlowgraph.setSelectedKey('0')
    oInputFilial.setSelectedKey('0')
    var oModel = new sap.ui.model.json.JSONModel();        // created a JSON model      
    oModel.setData({modelData: []});                              // Set the data to the model using the JSON object defined already
    oTableLogs.setModel(oModel);                                                                                  
    oTableLogs.bindRows("/modelData");
  }
var flowgraph = {}
var LogRecordsFull = {keys:[]}
var LogRecords = []
var oTextloadRecords =  new sap.m.Text({text:'Total Registros: '})
var oInputSelectFilter = new sap.m.Select("oInputSelectFilter", {name: "Filial", width: "200px"})
oInputSelectFilter.addItem(new sap.ui.core.Item({key: '1', text: 'Fallidos'}));
oInputSelectFilter.addItem(new sap.ui.core.Item({key: '2', text: 'Exitosos'}));
oInputSelectFilter.addItem(new sap.ui.core.Item({key: '0', text: 'Todos'}));
oInputSelectFilter.setSelectedKey('1')
oInputSelectFilter.attachChange({}, function() {
    switch (oInputSelectFilter.getSelectedItem().getKey()) {
      case '0':
          fillTableUploadDate(LogRecords)
          break;
      case '1':
          fillTableUploadDate(LogRecords.filter(function(record) {
              return record.STATUS === 'FALLIDO' || record.STATUS === 'ERROR LLAVE REPETIDA'
          }))
          break;
      case '2':
          fillTableUploadDate(LogRecords.filter(function(record) {
              return record.STATUS === 'CORRECTO'
          }))
          break;
      default:
          fillTableUploadDate(LogRecords)
          break;
    }
});
var oBarNewTableUploadRecords = new sap.m.Bar( {
    contentLeft : [ oTextloadRecords ],
    contentMiddle : [],
    contentRight : [oInputSelectFilter]
});

var oTableUploadRecords = new sap.ui.table.Table({
  title:oBarNewTableUploadRecords,                                   // Displayed as the heading of the table
  selectionMode:sap.ui.table.SelectionMode.Single,
  enableColumnReordering:true,
  visibleRowCount: 4,
  width:"100%"                              // width of the table
});
var oTextLogs =  new sap.m.Text({text:'Logs :'})
var  recargarLogs = new sap.m.Button('Recargalog',{icon:'sap-icon://refresh'}).attachPress({}, function() {
    if (oInputFlowgraph.getSelectedItem().getKey() !== '0'){
        getJustLogs(oInputFlowgraph.getSelectedItem().getKey())
        fillTableUploadDate([])
    }
  });
var oBarNewTableLogs = new sap.m.Bar( {
  contentLeft : [oTextLogs],
  contentMiddle : [],
  contentRight : [recargarLogs]
});
var oTableLogs = new sap.ui.table.Table('oTableLogs',{
        title: oBarNewTableLogs,                                   // Displayed as the heading of the table
        selectionMode:sap.ui.table.SelectionMode.Single,
        enableColumnReordering:true,
        visibleRowCount: 4,       // Allows you to drag and drop the column and reorder the position of the column
        width:"100%"                              // width of the table
      }).addColumn(new sap.ui.table.Column({
          width: "300px",
          label: new sap.m.Label({text: "Usuario"}),             // Creates an Header with value defined for the text attribute
          template: new sap.m.Text().bindProperty("text", "USER"), // binds the value into the text field defined using JSON
          sortProperty: "USER",        // enables sorting on the column
          filterProperty: "USER",       // enables set filter on the column
        })).addColumn(new sap.ui.table.Column({
            width: "125px",
          label: new sap.ui.commons.Label({text: "Estado"}),             // Creates an Header with value defined for the text attribute
          template: new sap.m.Text().bindText("STATUS", function(fValue) {
                if (typeof fValue === "string") {
                    if (fValue === "COMPLETADO"){
                        this.removeStyleClass("TextError");
                        this.removeStyleClass("TextWarning");
                        this.addStyleClass("TextSuccess");
                    } else if (fValue === "FALLIDO"){
                        this.removeStyleClass("TextSuccess");
                        this.removeStyleClass("TextWarning");
                        this.addStyleClass("TextError");
                    } else if (fValue === "ERROR LLAVE REPETIDA"){
                        this.removeStyleClass("TextSuccess");
                        this.removeStyleClass("TextWarning");
                        this.addStyleClass("TextError");
                    } else if (fValue === "PENDIENTE"){
                        this.removeStyleClass("TextSuccess");
                        this.removeStyleClass("TextError");
                        this.addStyleClass("TextWarning");
                    } else if (fValue === "DESHABILITADA"){
                        this.removeStyleClass("TextSuccess");
                        this.removeStyleClass("TextError");
                        this.addStyleClass("TextWarning");
                    } else if (fValue === "INCOMPLETO"){
                        this.removeStyleClass("TextSuccess");
                        this.removeStyleClass("TextError");
                        this.addStyleClass("TextWarning");
                    } else {
                        this.removeStyleClass("TextSuccess");
                        this.removeStyleClass("TextError");
                        this.removeStyleClass("TextWarning");
                    }
                    return fValue;
                }
                return "";
            }), // binds the value into the text field defined using JSON
          sortProperty: "STATUS",        // enables sorting on the column
          filterProperty: "STATUS",       // enables set filter on the column
        })).addColumn(new sap.ui.table.Column({
            width: "200px",
          label: new sap.m.Label({text: "Tipo"}),             // Creates an Header with value defined for the text attribute
          template: new sap.m.Text().bindProperty("text", "TIPO"), // binds the value into the text field defined using JSON
          sortProperty: "TIPO",        // enables sorting on the column
          filterProperty: "TIPO",       // enables set filter on the column
        })).addColumn(new sap.ui.table.Column({
            width: "125px",
          label: new sap.m.Label({text: "Fecha"}),             // Creates an Header with value defined for the text attribute
          template: new sap.m.Text().bindProperty("text", "fecha"), // binds the value into the text field defined using JSON
          sortProperty: "fecha",        // enables sorting on the column
          filterProperty: "fecha",       // enables set filter on the column
        })).addColumn(new sap.ui.table.Column({
            width: "125px",
            label: new sap.m.Label({text: "Hora"}),             // Creates an Header with value defined for the text attribute
            template: new sap.m.Text().bindProperty("text", "hora"), // binds the value into the text field defined using JSON
            sortProperty: "hora",        // enables sorting on the column
            filterProperty: "hora",       // enables set filter on the column
          })).addColumn(new sap.ui.table.Column({
              width: "125px",
            label: new sap.m.Label({text: "Fecha fin"}),             // Creates an Header with value defined for the text attribute
            template: new sap.m.Text().bindProperty("text", "fecha_fin"), // binds the value into the text field defined using JSON
            sortProperty: "fecha_fin",        // enables sorting on the column
            filterProperty: "fecha_fin",       // enables set filter on the column
          })).addColumn(new sap.ui.table.Column({
              width: "125px",
              label: new sap.m.Label({text: "Hora fin"}),             // Creates an Header with value defined for the text attribute
              template: new sap.m.Text().bindProperty("text", "hora_fin"), // binds the value into the text field defined using JSON
              sortProperty: "hora_fin",        // enables sorting on the column
              filterProperty: "hora_fin",       // enables set filter on the column
            })).addColumn(new sap.ui.table.Column({
                width: "500px",
            label: new sap.m.Label({text: "Mensaje"}),             // Creates an Header with value defined for the text attribute
            template: new sap.m.Text().bindProperty("text", "LOG"), // binds the value into the text field defined using JSON
            sortProperty: "LOG",        // enables sorting on the column
            filterProperty: "LOG",       // enables set filter on the column
          }))

function getFilialByUser(userQ, isETL){
    $.ajax({
      "url": SERVER_MONITOR + (isBlank(userQ) ? 'filial_user.xsjs/?username=ALL' : "filial_user.xsjs/?username="+userQ.toUpperCase()) ,
      "success": function(data) {
        responseJson = JSON.parse(data);
        var oModel = new sap.ui.model.json.JSONModel();        // created a JSON model      

        oModel.setData({modelData: responseJson.records});                              // Set the data to the model using the JSON object defined already

        oTableFilialUser.setModel(oModel);                                                                                  

        oTableFilialUser.bindRows("/modelData");
        oInputSubFilia.removeAllItems()
        if (isETL) {
            oInputSubFilia.addItem(itemSelectSubFilia);
            responseJson.records.map(function(record){
                oInputSubFilia.addItem(new sap.ui.core.Item({key: record.ID_SUB_FILIAL, text: record.NAME}));
            })
        } else {
            getFilial()
        }
        oInputSubFilia.setSelectedKey('0')
      },
      "error": function(){
        logout()
      },
      "complete": function() {
        //location.reload()
      }
    });
}
function deleteRecordsFiliar(){
    var arrayIndex = oTableFilialUser.getSelectedIndices()
    if (arrayIndex.length > 0) {
        var values = []
        arrayIndex.map(function(indexRow) {

          var keysForDelete = oTableFilialUser.getModel().oData.modelData[indexRow]
          values.push(keysForDelete.ID_FILIAL_USER)
        })
        if (values.length > 0) {
            if (true) {
                $.ajax({
                  "url": SERVER+'deleteAnyTable.xsjs/',
                  contentType: "application/json; charset=utf-8",
                  dataType: "json",
                  type: "POST",
                  "data": JSON.stringify({
                      pk: {name: 'ID_FILIAL_USER', value: values},
                      name: 'FILIAL_USER',
                      schema: 'DATO_MAESTRO_ADMIN' 
                  }),
                  "success": function(data) {
                    var responseJson = {}
                    if (typeof(data) == 'String') {
                      responseJson = JSON.parse(data);
                    } else {
                      responseJson = data  
                    }
                    getFilialByUser(oSearchField.getValue());
                  },
                  "error": function(){
                    logout()
                  },
                  "complete": function() {
                    //location.reload()
                  }
                });
            }
        }
    } else {
        oDialogoErro.open()
    }
}
var  eliminarUsuarioFiliar = new sap.m.Button('eliminarUsuarioFilial',{icon:'sap-icon://delete'}).attachPress({}, function() {
    deleteRecordsFiliar()
});
var oBarNewTableUsuarioFiliar = new sap.m.Bar( {
    contentLeft : [new sap.m.Text({text:'Usuarios por Filial'})],
    contentMiddle : [],
    contentRight : [eliminarUsuarioFiliar]
});

var oTableFilialUser = new sap.ui.table.Table('oTableFilialUser',{
        title: oBarNewTableUsuarioFiliar,                                   // Displayed as the heading of the table
        selectionMode:sap.ui.table.SelectionMode.MultiToggle,
        enableColumnReordering:true,       // Allows you to drag and drop the column and reorder the position of the column
        width:"100%"                              // width of the table
      }).addColumn(new sap.ui.table.Column({
          width: "350px",
          label: new sap.m.Label({text: "Usuario"}),             // Creates an Header with value defined for the text attribute
          template: new sap.m.Text().bindProperty("text", "USER"), // binds the value into the text field defined using JSON
          sortProperty: "USER",        // enables sorting on the column
          filterProperty: "USER",       // enables set filter on the column
        })).addColumn(new sap.ui.table.Column({
            width: "400px",
          label: new sap.m.Label({text: "Filial"}),             // Creates an Header with value defined for the text attribute
          template: new sap.m.Text().bindProperty("text", "NAME"), // binds the value into the text field defined using JSON
          sortProperty: "NAME",        // enables sorting on the column
          filterProperty: "NAME",       // enables set filter on the column
        }))

var oDialogoErroEjecutarETL = new sap.m.Dialog(
  {title: 'Error', icon:'sap-icon://error'}
).addButton( new sap.m.Button({text: "Cerrar"}).attachPress(function(argument) {
  oDialogoErroEjecutarETL.close()
})
).addContent(new sap.m.Text({text:' Esta carga está inhabilitada, consulte con el aministrador. '}))
function getLogs(flowgraph) {
  fillTableUploadDate([])
  ejecutarBotton.setEnabled(false)
  ejecutarBotton.setText('Ejecutando ...')
  $.get(SERVER_MONITOR+"logic.xsjs?flowgraph="+flowgraph +"&filiar="+oInputSubFilia.getSelectedKey()+'&user='+ user.firstName.toUpperCase() + ' ' + user.lastName.toUpperCase() ,function(result){
    ejecutarBotton.setText('Ejecutar ETL')
    ejecutarBotton.setEnabled(true)
    var model = JSON.parse(result)
    if (!model.error) {
      var records = model.records
      var trueModel = records.map((item) => {
        return {...item, hora: item.CREATE_DATE.split('T')[1].split('.')[0] , fecha: item.CREATE_DATE.split('T')[0], hora_fin: item.END_DATE ? item.END_DATE.split('T')[1].split('.')[0] : '' , fecha_fin: item.END_DATE ? item.END_DATE.split('T')[0] : ''}
      })
      var oModel = new sap.ui.model.json.JSONModel();        // created a JSON model      

      oModel.setData({modelData: trueModel});                              // Set the data to the model using the JSON object defined already

      oTableLogs.setModel(oModel);                                                                                  

      oTableLogs.bindRows("/modelData");
    } else if (model.display){
      oDialogoErroEjecutarETL.open()
    }
  });
}
function getFlowgraph() {
  fillTableUploadDate([])
  oInputFlowgraph.removeAllItems()
  oInputFlowgraph.addItem(itemSelect);
  $.get(SERVER_MONITOR+"flowgraph.xsjs",function(result){
    JSON.parse(result).map(function(item){
        oInputFlowgraph.addItem(new sap.ui.core.Item({key: item.NAME, text: (!item.LABEL || isBlank(item.LABEL)) ? item.NAME : item.LABEL }));
    })
  });
}
function getFlowgraphPorFilial(filial) {
  oInputFlowgraph.removeAllItems()
  oInputFlowgraph.addItem(itemSelect);
  $.get(SERVER_MONITOR+"filial_by_etl.xsjs?filial="+filial,function(result){
    JSON.parse(result).records.map(function(item){
        oInputFlowgraph.addItem(new sap.ui.core.Item({key: item.ETL_NAME, text: item.ETL_LABEL}));
    })
  });
}
function getJustLogs(flowgraph) {
  fillTableUploadDate([])
  $.get(SERVER_MONITOR+"logs.xsjs?flowgraph="+flowgraph+"&filiar="+oInputSubFilia.getSelectedKey(),function(result){
    var model = JSON.parse(result)
    if (!model.error) {
      var trueModel = model.map((item) => {
        return {...item, hora: item.CREATE_DATE.split('T')[1].split('.')[0] , fecha: item.CREATE_DATE.split('T')[0], hora_fin: item.END_DATE ? item.END_DATE.split('T')[1].split('.')[0] : '' , fecha_fin: item.END_DATE ? item.END_DATE.split('T')[0] : ''}
      })
      var oModel = new sap.ui.model.json.JSONModel();        // created a JSON model      

      oModel.setData({modelData: trueModel});                              // Set the data to the model using the JSON object defined already

      oTableLogs.setModel(oModel);                                                                                  

      oTableLogs.bindRows("/modelData");
    }
  });
}
function fillTableUploadDate(modelZ) {
    var oModel = new sap.ui.model.json.JSONModel();        // created a JSON model    
    oModel.setData({modelData: []});                              // Set the data to the model using the JSON object defined already
    oTableUploadRecords.setModel(oModel);                                                                                  
    oTableUploadRecords.bindRows("/modelData");
    var trueModel = modelZ.map((item) => {
        LogRecordsFull.keys.map(function(keyLog){
            item[keyLog.name] = String(item[keyLog.name])
            if (item.CAMPO_ERROR.indexOf(keyLog.name) > -1){
              item['CLASS_'+keyLog.name] = 'TextError2'
            } else {
              item['CLASS_'+keyLog.name] = 'myTextNomal'
            }
        })
        return {...item, icon: item.STATUS === 'COMPLETADO'  ? 'sap-icon://accept' : 'sap-icon://decline'}
    })
    oTableUploadRecords.removeAllColumns();
    LogRecordsFull.keys.map((visibleKey) => {
        switch(visibleKey.name) {
          case 'ID_DETALLE_PYG':
            
            break;
          case 'ETL':
            
              break;
          case 'ID_LOG':
            
              break;
          case 'ID_VALIDACION':
              
              break;
          case 'CAMPO_ERROR':
              
            break;
          case 'CREATE_DATE':
              
            break;
          case 'STATUS':
            oTableUploadRecords.addColumn(new sap.ui.table.Column({
              width: "100px",
              label: new sap.ui.commons.Label({text: "Estado"}),             // Creates an Header with value defined for the text attribute
              template: new sap.m.Text().bindText('STATUS'), // binds the value into the text field defined using JSON
              sortProperty: visibleKey.name,        // enables sorting on the column
              filterProperty: visibleKey.name,       // enables set filter on the column
            }));
            break;
          case 'DETALLE_ERROR':
            oTableUploadRecords.addColumn(new sap.ui.table.Column({
              width: "500px",
              label: new sap.ui.commons.Label({text: "DETALLE ERROR"}),             // Creates an Header with value defined for the text attribute
              template: new sap.m.Text().bindText('DETALLE_ERROR'), // binds the value into the text field defined using JSON
              sortProperty: visibleKey.name,        // enables sorting on the column
              filterProperty: visibleKey.name,       // enables set filter on the column
            }));
            break;
          default:
            if (visibleKey.name.indexOf('ID_HISTORICO_CARGA_') < 0) {
              oTableUploadRecords.addColumn(new sap.ui.table.Column({
                width:  String(visibleKey.name.length * 15) + "px",
                label: new sap.ui.commons.Label({text: visibleKey.label}),             // Creates an Header with value defined for the text attribute
                template: new sap.m.Text().bindText('', function(params) {
                  this.removeStyleClass("TextError2");
                  this.addStyleClass(params && params['CLASS_'+visibleKey.name] ? params['CLASS_'+visibleKey.name] : '' )
                  return params && params[visibleKey.name] && params[visibleKey.name] != null && params[visibleKey.name] != 'null' ? params[visibleKey.name] : ''
                }), // binds the value into the text field defined using JSON
                sortProperty: visibleKey.name,        // enables sorting on the column
                filterProperty: visibleKey.name,       // enables set filter on the column
              }));
            }
            break;
        }
      })
      oModel.setData({modelData: trueModel});                              // Set the data to the model using the JSON object defined already
      oTableUploadRecords.setModel(oModel);                                                                                  
      oTableUploadRecords.bindRows("/modelData");
}
function getRecords(cell) {
  oTableUploadRecords.removeAllColumns();
  $.get(SERVER_MONITOR+"records.xsjs?flowgraph="+cell.FLOWGRAPH+"&&log="+cell.ID_LOG,function(result){
    var model = JSON.parse(result)
    if (!model.error) {
        LogRecords = model.records
        LogRecordsFull = model
        oTextloadRecords.setText('Total Registro: ' + LogRecords.length + ', Exitosos: ' + LogRecords.filter(function(record) {
          return record.STATUS === 'CORRECTO'
        }).length + ', Fallidos: ' + LogRecords.filter(function(record) {
          return record.STATUS === 'FALLIDO' || record.STATUS === 'ERROR LLAVE REPETIDA'
        }).length)
        switch (oInputSelectFilter.getSelectedItem().getKey()) {
            case '0':
                fillTableUploadDate(LogRecords)
                break;
            case '1':
                fillTableUploadDate(LogRecords.filter(function(record) {
                    return record.STATUS === 'FALLIDO' || record.STATUS === 'ERROR LLAVE REPETIDA'
                }))
                break;
            case '2':
                fillTableUploadDate(LogRecords.filter(function(record) {
                    return record.STATUS === 'CORRECTO'
                }))
                break;
        
            default:
                fillTableUploadDate(LogRecords)
                break;
        }
    }
  });
}

// create a simple button with some text and a tooltip only
oTableLogs.attachRowSelectionChange(
  function(cell) {
    console.log(oTableLogs, this, cell)
    if (oTableLogs.getSelectedIndices().length > 0) {
      var cells = oTableLogs.getModel().oData.modelData[oTableLogs.getSelectedIndices()[0]]
      getRecords(cells)
    }
  }
)
// attach buttom to some element in the page
var  ejecutarBotton = new sap.m.Button(ejecutarBotton,{text:'Ejecutar ETL', type: sap.m.ButtonType.Emphasized}).attachPress({}, function() {
    if (oInputFlowgraph.getSelectedItem().getKey() !== '0' && oInputSubFilia.getSelectedKey() !== '0'){
        getLogs(oInputFlowgraph.getSelectedItem().getKey());
        fillTableUploadDate([])
    } else {
        alert("Debe selecionar una carga y una filial")
    }
  });

setInterval(function () {
    $( "tr:has(td):has(div)" ).removeClass( "myTextWarning" ).removeClass( "myTextSuccess" ).removeClass( "myTextError" )
    $( "tr:has(td):has(div):has(.TextSuccess)" ).addClass( "myTextSuccess" );
    $( "tr:has(td):has(div):has(.TextError)" ).addClass( "myTextError" );
    $( "tr:has(td):has(div):has(.TextWarning)" ).addClass( "myTextWarning" );
    $( "td:has(div)" ).removeClass( "myTextWarning" ).removeClass( "myTextSuccess" ).removeClass( "myTextError" )
    $( "td:has(div):has(.TextError2)" ).addClass( "myTextError" );
}, 100)

    var oButtonUserPermises = new sap.m.Button('oButtonUserPermises', {width: '100%', icon:'sap-icon://user-settings', text: 'Administrador de Permisos Datos Maestros'}).attachPress({}, function() {
      AddUserScream();
    });
    var oButtonDatosMaestros = new sap.m.Button('oButtonDatosMaestros', {width: '100%', icon:'sap-icon://table-column', text: 'Administrador de Datos Maestros'}).attachPress({}, function() {
      getAdmin(user)
    });
    var oButtonDatosMaestrosCargas = new sap.m.Button('oButtonDatosMaestrosCargas', {width: '100%', icon:'sap-icon://sys-prev-page', text: 'Carga ETL SIC'}).attachPress({}, function() {
      monitoreView()
    });
    var oButtonValidacionesDeCarga = new sap.m.Button('oButtonValidacionesDeCarga', {width: '100%', icon:'sap-icon://accept', text: 'Validaciones ETL'}).attachPress({}, function() {
        ETLValidaciones()
    });
    var oButtonPermisosEtl = new sap.m.Button('oButtonPermisosEtl', {width: '100%', icon:'sap-icon://role', text: 'Administrador de Permisos Usuarios por Filial'}).attachPress({}, function() {
        ETLPermiso()
    });
    var oButtonETLPorFilial = new sap.m.Button('oButtonETLPorFilial', {width: '100%', icon:'sap-icon://geographic-bubble-chart', text: 'Cargas por Filial'}).attachPress({}, function() {
      ETLPorFilial()
    });
    var oButtonGestrorDeCargas = new sap.m.Button('oButtonGestrorDeCargas', {width: '100%', icon:'sap-icon://customize', text: 'Gestor de Cargas por Filial'}).attachPress({}, function() {
      GestrorDeCargas()
    });
    var oButtonDeshabilitarCargaAuto = new sap.m.Button('oButtonDeshabilitarCargaAuto', {width: '100%', icon:'sap-icon://status-inactive', text: 'Deshabilitar Carga Automaticamente'}).attachPress({}, function() {
      DeshabilitarCargaAuto()
    });
    var oButtonEmailNotify = new sap.m.Button('oButtonEmailNotify', {width: '100%', icon:'sap-icon://email', text: 'Notificaciones y Usuarios Administradores'}).attachPress({}, function() {
      EmailNotify()
    });
    var oGrid6 = new sap.ui.layout.Grid('oGrid6',{defaultSpan:"L6 M6 S12"})
    function BodyInt(){
      isLoad = false
      TituloDeLaAplicacion.setText("Menú Principal")
      oGridBeforeHeader.removeAllContent()
      oGridHeader.removeAllContent()
      oGridBody.removeAllContent()
      oGrid6.removeAllContent()
      oGridIndexBody.removeAllContent()
      OFullConten.setShowSideContent( false )
      oGrid6.addContent(oButtonUserPermises);
      oGrid6.addContent(oButtonDatosMaestros);
      oGrid6.addContent(oButtonPermisosEtl);
      oGrid6.addContent(oButtonDatosMaestrosCargas);
      oGrid6.addContent(oButtonValidacionesDeCarga);
      oGrid6.addContent(oButtonGestrorDeCargas);
      oGrid6.addContent(oButtonETLPorFilial);
      oGrid6.addContent(oButtonDeshabilitarCargaAuto);
      oGrid6.addContent(oButtonEmailNotify);
      oGridIndexBody.addContent(oGrid6)
      oBar.removeAllContentLeft()
    }
    function addFiliar(){
        if (oInputSubFilia.getSelectedKey() !== '0' && !isBlank(oSearchField.getValue())){
            $.ajax({
              "url": SERVER_MONITOR + "addUserFilial.xsjs/",
              contentType: "application/json; charset=utf-8",
              dataType: "json",
              type: "POST",
              "data": JSON.stringify({
                user: oSearchField.getValue().toUpperCase(),
                filial: oInputSubFilia.getSelectedKey()
              }),
              "success": function(data) {
                var responseJson = {}
                if (typeof(data) == 'String') {
                  responseJson = JSON.parse(data);
                } else {
                  responseJson = data  
                }
                getFilialByUser(oSearchField.getValue());
                oInputSubFilia.setSelectedKey('0')
              },
              "error": function(){
                logout()
              },
              "complete": function() {
                //location.reload()
              }
            });
        }
    }
    var oButtonAddFiliar = new sap.m.Button('oButtonAddFilial', {width: '100%', icon:'sap-icon://key', text: 'Agregar Filial'}).attachPress({}, function() {
      addFiliar();
    });
    function ETLPermiso(){
        TituloDeLaAplicacion.setText("Administrador de Permisos Usuarios por Filial")
        getFlowgraph()
        getFilialByUser('')
        oGridBeforeHeader.removeAllContent()
        oGridHeader.removeAllContent()
        oGridBody.removeAllContent()
        oGridinputCheckBox.removeAllContent()
        oGridBeforeHeader.addContent(oSearchField)
        oGridHeader.addContent(oInputFilial)
        oGridHeader.addContent(oInputSubFilia)
        oGridHeader.addContent(oButtonAddFiliar)
        oGridBody.addContent(oTableFilialUser)
        oInputFilial.setSelectedKey('0')
        oInputFlowgraph.setSelectedKey('0')
        oBar.removeAllContentLeft()
        oBar.addContentLeft(oButtonBack)
        oGridIndexBody.removeAllContent()
    }
    var itemSelect = new sap.ui.core.Item({key: "0", text: "Seleccione una ETL"});
    var oButtonAddValidations = new sap.m.Button('oButtonAddValidations', {width: '100%', icon:'sap-icon://accept', text: 'Agregar Validacion ETL'}).attachPress({}, function() {
        addValidations()
    });

    function deleteRecordsValidacion(){
      var arrayIndex = oTableValidationsETL.getSelectedIndices()
      if (arrayIndex.length > 0) {
          var values = []
          arrayIndex.map(function(indexRow) {
            var keysForDelete = oTableValidationsETL.getModel().oData.modelData[indexRow]
            values.push(keysForDelete.ID_VALIDACION)
          })
          if (values.length > 0) {
              if (true) {
                $.ajax({
                  "url": SERVER+'deleteAnyTable.xsjs/',
                  contentType: "application/json; charset=utf-8",
                  dataType: "json",
                  type: "POST",
                  "data": JSON.stringify({
                      pk: {name: 'ID_VALIDACION', value: values},
                      name: 'VALIDACION',
                      schema: 'DETALLE_CARGA' 
                  }),
                  "success": function(data) {
                    var responseJson = {}
                    if (typeof(data) == 'String') {
                      responseJson = JSON.parse(data);
                    } else {
                      responseJson = data  
                    }
                    getJustValidations();
                    oDialogoConfirmaEliminacionValidacionETL.close()
                  },
                  "error": function(){
                    logout()
                  },
                  "complete": function() {
                    //location.reload()
                  }
                });
              }
          }
      } else {
          oDialogoErro.open()
      }
    }
    var oDialogoConfirmaEliminacionValidacionETL = new sap.m.Dialog(
      {title: 'Error', icon:'sap-icon://error'}
    ).addButton( new sap.m.Button({text: "Aceptar"}).attachPress(function(argument) {
      deleteRecordsValidacion()
    })).addButton( new sap.m.Button({text: "Cerrar"}).attachPress(function(argument) {
      oDialogoConfirmaEliminacionValidacionETL.close()
    })).addContent(new sap.m.Text({text:' Está seguro de eliminar estas validaciones '}))
    var eliminarValidacion = new sap.m.Button('eliminarValidacion',{icon:'sap-icon://delete'}).attachPress({}, function() {
        oDialogoConfirmaEliminacionValidacionETL.open()
    });
    var oBarNewTableValidationETL = new sap.m.Bar( {
        contentLeft : [new sap.m.Text({text:'Validaciones'})],
        contentMiddle : [],
        contentRight : [eliminarValidacion]
    });
    
    var oTableValidationsETL = new sap.ui.table.Table('oTableValidationsETL',{
      title: oBarNewTableValidationETL,                                   // Displayed as the heading of the table
      selectionMode:sap.ui.table.SelectionMode.MultiToggle,
      enableColumnReordering:true,
      visibleRowCount: 6,       // Allows you to drag and drop the column and reorder the position of the column
      width:"100%"                              // width of the table
    }).addColumn(new sap.ui.table.Column({
      width: "125px",
      label: new sap.m.Label({text: "ETL"}),             // Creates an Header with value defined for the text attribute
      template: new sap.m.Text().bindProperty("text", "ETL"), // binds the value into the text field defined using JSON
      sortProperty: "ETL",        // enables sorting on the column
      filterProperty: "ETL",       // enables set filter on the column
    })).addColumn(new sap.ui.table.Column({
      width: "200px",
      label: new sap.m.Label({text: "Campos"}),             // Creates an Header with value defined for the text attribute
      template: new sap.m.Text().bindProperty("text", "CAMPO"), // binds the value into the text field defined using JSON
      sortProperty: "CAMPO",        // enables sorting on the column
      filterProperty: "CAMPO",       // enables set filter on the column
    })).addColumn(new sap.ui.table.Column({
      width: "200px",
      label: new sap.m.Label({text: "Usuario Creador"}),             // Creates an Header with value defined for the text attribute
      template: new sap.m.Text().bindProperty("text", "USUARIO_CREACION"), // binds the value into the text field defined using JSON
      sortProperty: "USUARIO_CREACION",        // enables sorting on the column
      filterProperty: "USUARIO_CREACION",       // enables set filter on the column
    })).addColumn(new sap.ui.table.Column({
      width: "700px",
      label: new sap.m.Label({text: "Validación"}),             // Creates an Header with value defined for the text attribute
      template: new sap.m.Text().bindProperty("text", "LABEL"), // binds the value into the text field defined using JSON
      sortProperty: "LABEL",        // enables sorting on the column
      filterProperty: "LABEL",       // enables set filter on the column
    }))
    function getJustValidations() {
        $.get(SERVER_MONITOR+"validation.xsjs?etl="+oInputFlowgraph.getSelectedKey(),function(result){
          var model = JSON.parse(result)
          if (!model.error) {
            var oModel = new sap.ui.model.json.JSONModel();        // created a JSON model      
            oModel.setData({modelData: model.records});
            oTableValidationsETL.setModel(oModel);                                                                                  
      
            oTableValidationsETL.bindRows("/modelData");
          }
        });
      }
    function addValidations(){
        var pase = oInputFlowgraph.getSelectedKey() !== '0' ? false : 'Debe Seleccionar una carga'
        var paseField = false
        var paseConditionalValidations = false
        var paseConditional = false
        var arrayFiled = oInputFieldValidationsList.map(function(field) {
            if (isBlank(field.getValue().toUpperCase())) {
                paseField = 'Todos los campos de columnas deben estar diligenciados, '
            } else if (field.getValue().toUpperCase().indexOf(',') > -1){
                paseField = 'Debe ser un solo campo'
            }
            return field.getValue().toUpperCase()
        })
        var arrayConditionalValidations = oInputConditionalValidationsList.map(function(field, index) {
            if (isBlank(field.getValue().toUpperCase())) {
                paseConditionalValidations = 'Todos los campos de valor a comparar deben estar diligenciados'
            }
            return field.getValue().toUpperCase()
        })
        var arryConditiona = oInputConditionalList.map(function(field, index) {
            if (field.getSelectedItem().getKey()=== '0') {
                paseConditional = 'Todos los campos de condicionales deben estar diligenciados'
            } else if (field.getSelectedItem().getKey()=== 'IN' && oInputConditionalValidationsList[index].getValue().toUpperCase().indexOf(',') === -1) {
                paseConditional = 'Debes Separarar los campos por comas cuando selecciona la opción de los campos "dentro de"'
            }
            return field.getSelectedItem().getKey()
        })
        var dicc = {
            user: user.firstName.toUpperCase() +' '+user.lastName.toUpperCase() ,
            field: arrayFiled,
            flowgraph: oInputFlowgraph.getSelectedItem().getKey(),
            conditional: arryConditiona,
            conditionales: arrayConditionalValidations
        }
        var testtodialoerrorvalidaciones = new sap.m.Text({text: pase ? pase : ''})
        var oDialogoErroAddValidations = new sap.m.Dialog(
            {title: 'Error', icon:'sap-icon://error'}
        ).addButton( new sap.m.Button({text: "Cerrar"}).attachPress(function(argument) {
            oDialogoErroAddValidations.close()
        })
        ).addContent(testtodialoerrorvalidaciones)
        if (!pase && !paseField && !paseConditionalValidations && !paseConditional){
            $.ajax({
              "url": SERVER_MONITOR + "addNewValidations.xsjs/",
              contentType: "application/json; charset=utf-8",
              dataType: "json",
              type: "POST",
              "data": JSON.stringify(dicc),
              "success": function(data) {
                var responseJson = {}
                if (typeof(data) == 'String') {
                  responseJson = JSON.parse(data);
                } else {
                  responseJson = data  
                }
                getJustValidations();
              },
              "error": function(){
                logout()
              },
              "complete": function() {
                //location.reload()
              }
            });
        } else {
            var texto = ''
            if (pase) {
                texto = texto + pase
                testtodialoerrorvalidaciones.setText(texto)
            }
            if (paseField) {
                texto = texto + paseField
                testtodialoerrorvalidaciones.setText(texto)
            }
            if (paseConditionalValidations) {
                texto = texto + paseConditionalValidations
                testtodialoerrorvalidaciones.setText(texto)
            }
            if (paseConditional) {
                texto = texto + paseConditional
                testtodialoerrorvalidaciones.setText(texto)
            }
            oDialogoErroAddValidations.open()
        }
    }
    var oGridBodyCondition = new sap.ui.layout.Grid({defaultSpan:"L4 M4 S4"});
    var oGridBodyConditionButton = new sap.ui.layout.Grid({defaultSpan:"L4 M4 S4"});
    var conditionales = [
        new sap.ui.core.Item({key: '0', text: 'Selecione un condicional'}),
        new sap.ui.core.Item({key: '=', text: 'Igual que'}),
        new sap.ui.core.Item({key: '<>', text: 'Diferente que'}),
        new sap.ui.core.Item({key: '>', text: 'Mayor que'}),
        new sap.ui.core.Item({key: '<', text: 'Menor que'}),
        new sap.ui.core.Item({key: '>=', text: 'Mayor o igual que'}),
        new sap.ui.core.Item({key: '<=', text: 'Menor o igual que'}),
        new sap.ui.core.Item({key: 'LIKE', text: 'Parecido a'}),
        new sap.ui.core.Item({key: 'IN', text: 'Dentro de'})
    ]
    var oInputFieldValidations = new sap.m.Input("oInputFieldValidations", {width: '100%'}).setPlaceholder('Campos a validar')
    var oInputConditionalValidations = new sap.m.Input("oInputConditionalValidations", {width: '100%'}).setPlaceholder('Valor a comparar, en caso de ser varios separelos por ","')
    var oInputConditional = new sap.m.Select("oInputConditional", {width: "100%", items: conditionales})
    var oInputFieldValidationsList = [oInputFieldValidations]
    var oInputConditionalValidationsList = [oInputConditionalValidations]
    var oInputConditionalList = [oInputConditional]
    function addConditional() {
        oInputFieldValidationsList.push(new sap.m.Input({width: '100%'}).setPlaceholder('Campos a validar'))
        oInputConditionalValidationsList.push(new sap.m.Input({width: '100%'}).setPlaceholder('valor a comparar, en caso de ser varios separelos por ","'))
        var newConditionals = [
            new sap.ui.core.Item({key: '0', text: 'Selecione un condicional'}),
            new sap.ui.core.Item({key: '=', text: 'Igual que'}),
            new sap.ui.core.Item({key: '<>', text: 'Diferente que'}),
            new sap.ui.core.Item({key: '>', text: 'Mayor que'}),
            new sap.ui.core.Item({key: '<', text: 'Menor que'}),
            new sap.ui.core.Item({key: '>=', text: 'Mayor o igual que'}),
            new sap.ui.core.Item({key: '<=', text: 'Menor o igual que'}),
            new sap.ui.core.Item({key: 'LIKE', text: 'Parecido a'}),
            new sap.ui.core.Item({key: 'IN', text: 'Dentro de'})
        ]
        oInputConditionalList.push(new sap.m.Select({width: "100%", items: newConditionals}))
        oGridBodyCondition.addContent(oInputFieldValidationsList[oInputFieldValidationsList.length - 1])
        oGridBodyCondition.addContent(oInputConditionalList[oInputConditionalList.length - 1])
        oGridBodyCondition.addContent(oInputConditionalValidationsList[oInputConditionalValidationsList.length - 1])
    }
    function removeConditional() {
        length = oInputFieldValidationsList.length
        if  (length > 1){
            oInputFieldValidationsList = oInputFieldValidationsList.splice(-1,1)
            oInputConditionalValidationsList = oInputConditionalValidationsList.splice(-1,1)
            oInputConditionalList = oInputConditionalList.splice(-1,1)
            oGridBodyCondition.removeAllContent()
            oGridBodyCondition.addContent(oInputFieldValidationsList[0])
            oGridBodyCondition.addContent(oInputConditionalList[0])
            oGridBodyCondition.addContent(oInputConditionalValidationsList[0])
        }
    }
    var oButtonAddConditional = new sap.m.Button('oButtonAddConditional', {width: '100%', icon:'sap-icon://add', text: 'Agregar Condicional (AND)'}).attachPress({}, function() {
        addConditional()
    });
    var oButtonRemoveConditional = new sap.m.Button('oButtonRemoveConditional', {width: '100%', icon:'sap-icon://decline', text: 'Remover Condiconal'}).attachPress({}, function() {
        removeConditional()
    });
    
    function ETLValidaciones(){
      TituloDeLaAplicacion.setText("Validaciones ETL")
        oInputFieldValidationsList = [oInputFieldValidationsList[0]]
        oInputConditionalList = [oInputConditionalList[0]]
        oInputConditionalValidationsList = [oInputConditionalValidationsList[0]]
        getFlowgraph()
        getJustValidations()
        oGridBeforeHeader.removeAllContent()
        oGridHeader.removeAllContent()
        oGridBody.removeAllContent()
        oGridinputCheckBox.removeAllContent()
        oGridIndexBody.removeAllContent()
        oGridBeforeHeader.addContent(oInputFlowgraph)
        oGridBeforeHeader.addContent(oGridBodyCondition)
        oGridBeforeHeader.addContent(oGridBodyConditionButton)
        oGridBodyCondition.addContent(oInputFieldValidationsList[0])
        oGridBodyCondition.addContent(oInputConditionalList[0])
        oGridBodyCondition.addContent(oInputConditionalValidationsList[0])
        oGridBodyConditionButton.addContent(oButtonAddConditional)
        oGridBodyConditionButton.addContent(oButtonRemoveConditional)
        oGridBodyConditionButton.addContent(oButtonAddValidations)
        oGridIndexBody.addContent(oTableValidationsETL)
        //oGridHeader.addContent()
        //oGridBody.addContent()
        oInputFlowgraph.setSelectedKey('0')
        oInputFieldValidationsList[0].setValue('')
        oInputConditionalList[0].setSelectedKey('0')
        oInputConditionalValidationsList[0].setValue('')
        oBar.removeAllContentLeft()
        oBar.addContentLeft(oButtonBack)
    }
    function deleteRecorEtlPorFilial(){
      var arrayIndex = oTableEtlPorFilial.getSelectedIndices()
      if (arrayIndex.length > 0) {
          var values = []
          arrayIndex.map(function(indexRow) {
            var keysForDelete = oTableEtlPorFilial.getModel().oData.modelData[indexRow]
            values.push(keysForDelete.ID_CARGA_POR_FILIAL)
          })
          if (values.length > 0) {
              if (true) {
                $.ajax({
                  "url": SERVER+'deleteAnyTable.xsjs/',
                  contentType: "application/json; charset=utf-8",
                  dataType: "json",
                  type: "POST",
                  "data": JSON.stringify({
                      pk: {name: 'ID_CARGA_POR_FILIAL', value: values},
                      name: 'CARGA_POR_FILIAL',
                      schema: 'DATO_MAESTRO_ADMIN' 
                  }),
                  "success": function(data) {
                    var responseJson = {}
                    if (typeof(data) == 'String') {
                      responseJson = JSON.parse(data);
                    } else {
                      responseJson = data  
                    }
                    getEtlPorFilial('ALL');
                  },
                  "error": function(){
                    logout()
                  },
                  "complete": function() {
                    //location.reload()
                  }
                });
              }
          }
      } else {
          oDialogoErro.open()
      }
    }
    function getEtlPorFilial(filial) {
      oTableUploadRecords.removeAllColumns();
      $.get(SERVER_MONITOR+"filial_by_etl.xsjs?filial="+filial,function(result){
        var model = JSON.parse(result)
        if (!model.error) {
          var oModel = new sap.ui.model.json.JSONModel();        // created a JSON model      
          oModel.setData({modelData: model.records});                              // Set the data to the model using the JSON object defined already
          oTableEtlPorFilial.setModel(oModel);                                                                                  
          oTableEtlPorFilial.bindRows("/modelData");
        }
      });
    }
    var oDialogoConfirmaEliminacionETLPorFilial = new sap.m.Dialog(
      {title: 'Error', icon:'sap-icon://error'}
    ).addButton( new sap.m.Button({text: "Aceptar"}).attachPress(function(argument) {
      deleteRecorEtlPorFilial()
    })).addButton( new sap.m.Button({text: "Cerrar"}).attachPress(function(argument) {
      oDialogoConfirmaEliminacionETLPorFilial.close()
    })).addContent(new sap.m.Text({text:' Está seguro de eliminar estás cargas por filiales '}))
    var  eliminarETLPorFilial = new sap.m.Button('eliminarETLPorFilial',{icon:'sap-icon://delete'}).attachPress({}, function() {
        oDialogoConfirmaEliminacionETLPorFilial.open()
    });
    var oBarNewTableEtlPorFilial = new sap.m.Bar( {
        contentLeft : [new sap.m.Text({text:'Cargas por Filial'})],
        contentMiddle : [],
        contentRight : [eliminarETLPorFilial]
    });
    
    var oTableEtlPorFilial = new sap.ui.table.Table('oTableEtlPorFilial',{
      title: oBarNewTableEtlPorFilial,                                   // Displayed as the heading of the table
      selectionMode:sap.ui.table.SelectionMode.MultiToggle,
      enableColumnReordering:true,       // Allows you to drag and drop the column and reorder the position of the column
      width:"100%"                              // width of the table
    }).addColumn(new sap.ui.table.Column({
      label: new sap.m.Label({text: "ETL"}),             // Creates an Header with value defined for the text attribute
      template: new sap.m.Text().bindProperty("text", "ETL_LABEL"), // binds the value into the text field defined using JSON
      sortProperty: "ETL_LABEL",        // enables sorting on the column
      filterProperty: "ETL_LABEL",       // enables set filter on the column
    })).addColumn(new sap.ui.table.Column({
      label: new sap.m.Label({text: "Filial"}),             // Creates an Header with value defined for the text attribute
      template: new sap.m.Text().bindProperty("text", "NAME_FILIAL"), // binds the value into the text field defined using JSON
      sortProperty: "NAME_FILIAL",        // enables sorting on the column
      filterProperty: "NAME_FILIAL",       // enables set filter on the column
    }))
    function activeFiliar(record) {
        $.get(SERVER_MONITOR+"active_filial.xsjs?idSubFilial="+record['ID_SUB_FILIAL']+"&idflowgraph="+record['objectFlowgraph']['ID_FLOWGRAPH']+"&periodo="+oInputGestrorDeCargas.getValue(),function(result){
          var model = JSON.parse(result)
          if (!model.error) {
            getGetionDeCargas(oInputFlowgraph.getSelectedKey(), oInputGestrorDeCargas.getValue())
          }
        });
      }
    function deactiveFiliar(record) {
        $.get(SERVER_MONITOR+"deactive_filial.xsjs?idSubFilial="+record['ID_SUB_FILIAL']+"&idflowgraph="+record['objectFlowgraph']['ID_FLOWGRAPH']+"&periodo="+oInputGestrorDeCargas.getValue()+"&username="+user.name.toUpperCase(),function(result){
          var model = JSON.parse(result)
          if (!model.error) {
            getGetionDeCargas(oInputFlowgraph.getSelectedKey(), oInputGestrorDeCargas.getValue())
          }
        });
      }
    var oButtonAddEtlPorFilial = new sap.m.Button('oButtonAddEtlPorFilial', {width: '100%', icon:'sap-icon://add', text: 'Agregar Carga por Filial'}).attachPress({}, function() {
      oButtonAddEtlPorFilial.setEnabled(false)
      if (oInputSubFilia.getSelectedKey() !== '0' && oInputFlowgraph.getSelectedKey() !== '0') {
        $.ajax({
          "url": SERVER_MONITOR+'addEtlPorFilial.xsjs/',
          contentType: "application/json; charset=utf-8",
          dataType: "json",
          type: "POST",
          "data": JSON.stringify({
            filial: oInputSubFilia.getSelectedKey(),
            etl: oInputFlowgraph.getSelectedKey()
          }),
          "success": function(data) {
            var responseJson = {}
            if (typeof(data) == 'String') {
              responseJson = JSON.parse(data);
            } else {
              responseJson = data  
            }
            getEtlPorFilial('ALL');
          },
          "error": function(){
            //logout()
          },
          "complete": function() {
            oButtonAddEtlPorFilial.setEnabled(true)
            //location.reload()
          }
        });
      }
    });
    function ETLPorFilial(){
      TituloDeLaAplicacion.setText("Cargas por Filial")
      getFlowgraph()
      getSubFilial('ALL')
      getEtlPorFilial('ALL')
      oGridBeforeHeader.removeAllContent()
      oGridHeader.removeAllContent()
      oGridBody.removeAllContent()
      oGridinputCheckBox.removeAllContent()
      oGridHeader.addContent(oInputSubFilia)
      oGridHeader.addContent(oInputFlowgraph)
      oGridHeader.addContent(oButtonAddEtlPorFilial)
      oGridBody.addContent(oTableEtlPorFilial)
      oInputSubFilia.setSelectedKey('0')
      oInputFlowgraph.setSelectedKey('0')
      oBar.removeAllContentLeft()
      oBar.addContentLeft(oButtonBack)
      oGridIndexBody.removeAllContent()
    }
    var oBarNewTableGetionDeCargasText = new sap.m.Text({text:'Cargas Habilitadas para el Período: '})
    var oBarNewTableGetionDeCargasEnableBTN = new sap.m.Button({text: 'Habilitar',type: sap.m.ButtonType.Accept}).attachPress(function(params) {
      var arrayIndex = oTableGetionDeCargas.getSelectedIndices()
      var keysForDelete = ''
      var cells = {}
      if (arrayIndex.length > 0) {
        arrayIndex.map(function(indexRow) {
          cells = getKeysTablesFromRowsText(indexRow, oTableGetionDeCargas)
          if (!cells.IS_HABILITADO) {
            keysForDelete = keysForDelete + (keysForDelete.length == 0 ? cells.ID_SUB_FILIAL : ','+cells.ID_SUB_FILIAL)
          }
        })
      }
      activeFiliar({...cells, ID_SUB_FILIAL: keysForDelete})
    })
    var oBarNewTableGetionDeCargasDisableBTN = new sap.m.Button({text: 'Deshabilitar',type: sap.m.ButtonType.Reject}).attachPress(function(params) {
      var arrayIndex = oTableGetionDeCargas.getSelectedIndices()
      var keysForDelete = ''
      var cells = {}
      if (arrayIndex.length > 0) {
        arrayIndex.map(function(indexRow) {
          cells = getKeysTablesFromRowsText(indexRow, oTableGetionDeCargas)
          if (cells.IS_HABILITADO) {
            keysForDelete = keysForDelete + (keysForDelete.length == 0 ? cells.ID_SUB_FILIAL : ','+cells.ID_SUB_FILIAL)
          }
        })
      }
      deactiveFiliar({...cells, ID_SUB_FILIAL: keysForDelete})
    })
    var oBarNewTableGetionDeCargas = new sap.m.Bar( {
        contentLeft : [oBarNewTableGetionDeCargasText],
        contentMiddle : [],
        contentRight : [oBarNewTableGetionDeCargasEnableBTN, oBarNewTableGetionDeCargasDisableBTN]
    });
    
    var oTableGetionDeCargas = new sap.ui.table.Table('oTableGetionDeCargas',{
      title: oBarNewTableGetionDeCargas,                                   // Displayed as the heading of the table
      selectionMode: sap.ui.table.SelectionMode.MultiToggle,
      enableColumnReordering:true,       // Allows you to drag and drop the column and reorder the position of the column
      width:"100%"                              // width of the table
    })
    var oInputGestrorDeCargas = new sap.m.Input("oInputGestrorDeCargas", {width: '100%'}).setPlaceholder('Período')
    var oButtonGestrorDeCargasBuscar = new sap.m.Button('oButtonGestrorDeCargasBuscar', {width: '100%', icon:'sap-icon://search', text: 'Consultar'}).attachPress({}, function() {
      getGetionDeCargas(oInputFlowgraph.getSelectedKey(), oInputGestrorDeCargas.getValue())
    })
    var oButtonGestrorDeCargasActiveAll = new sap.m.Button('oButtonGestrorDeCargasActiveAll', {width: '100%', icon:'sap-icon://accept', text: 'Habilitar a Todas Las Filiales'}).attachPress({}, function() {
      activeAllFilial(oInputGestrorDeCargas.getValue())
    })
    function getGetionDeCargas(flowgraph, periodo) {
        var oModel = new sap.ui.model.json.JSONModel();        // created a JSON model      
        oModel.setData({modelData: []});
        oTableGetionDeCargas.setModel(oModel);                                                                                  
        oTableGetionDeCargas.bindRows("/modelData");
      oBarNewTableGetionDeCargasText.setText("Cargas Habilitadas para el Período: " +periodo)
        oTableGetionDeCargas.destroyColumns().addColumn(new sap.ui.table.Column({
            width: "300px",
            label: new sap.m.Label({text: "Filial"}),             // Creates an Header with value defined for the text attribute
            template: new sap.m.Text().bindProperty("text", "NAME"), // binds the value into the text field defined using JSON
            sortProperty: "NAME",        // enables sorting on the column
            filterProperty: "NAME",       // enables set filter on the column
          })).addColumn(new sap.ui.table.Column({
            width: "150px",
            label: new sap.m.Label({text: "Estado"}),             // Creates an Header with value defined for the text attribute
            template: new sap.m.Text().bindProperty("text", "STATUS"), // binds the value into the text field defined using JSON
            sortProperty: "STATUS",        // enables sorting on the column
            filterProperty: "STATUS",       // enables set filter on the column
          })).addColumn(new sap.ui.table.Column({
            width: "250px",
            label: new sap.m.Label({text: "Usuario Deshabilitador"}),             // Creates an Header with value defined for the text attribute
            template: new sap.m.Text().bindProperty("text", "USER_DISABLE"), // binds the value into the text field defined using JSON
          })).addColumn(new sap.ui.table.Column({
            width: "150px",
            label: new sap.m.Label({text: ""}),             // Creates an Header with value defined for the text attribute
            template: new sap.m.Text().bindProperty("text", "", function(params) {
              return params && params.IS_HABILITADO ? "Habilitada" : "Deshabilitada"
            }), // binds the value into the text field defined using JSON
          }))
      $.get(SERVER_MONITOR+"flowgraph_by_periodo.xsjs?flowgraph="+flowgraph+"&periodo="+periodo,function(result){
        var model = JSON.parse(result)
        if (!model.error) {
          var oModel = new sap.ui.model.json.JSONModel();        // created a JSON model      
          oModel.setData({modelData: model.records});
          oTableGetionDeCargas.setModel(oModel);                                                                                  
          oTableGetionDeCargas.bindRows("/modelData");
        }
      });
    }
    
    var oDialogoActiveAllFilial = new sap.m.Dialog(
      {title: 'Error', icon:'sap-icon://accept'}
    ).addButton( new sap.m.Button({text: "Cerrar"}).attachPress(function(argument) {
      oDialogoActiveAllFilial.close()
    })
    ).addContent(new sap.m.Text({text:' Filiales Activadas para Período. '}))

    function activeAllFilial(periodo) {
      $.get(SERVER_MONITOR+"active_all_filial.xsjs?periodo="+periodo,function(result){
        var model = JSON.parse(result)
        if (!model.error) {
          getGetionDeCargas(oInputFlowgraph.getSelectedKey(), oInputGestrorDeCargas.getValue())
        }
      });
    }
    
    function GestrorDeCargas(){
      TituloDeLaAplicacion.setText("Gestor de Cargas por Filial")
      getFlowgraph()
      getSubFilial('ALL')
      oGridBeforeHeader.removeAllContent()
      oGridHeader.removeAllContent()
      oGridBody.removeAllContent()
      oGridinputCheckBox.removeAllContent()
      oGridHeader.addContent(oInputFlowgraph)
      oGridHeader.addContent(oInputGestrorDeCargas)
      oGridHeader.addContent(oButtonGestrorDeCargasBuscar)
      //oGridHeader.addContent(oButtonGestrorDeCargasActiveAll)
      oGridBody.addContent(oTableGetionDeCargas)
      oInputSubFilia.setSelectedKey('0')
      oInputFlowgraph.setSelectedKey('0')
      oBar.removeAllContentLeft()
      oBar.addContentLeft(oButtonBack)
      oGridIndexBody.removeAllContent()
    }
    function DeleteDeshabilitarCargaAuto(){
      var arrayIndex = oTableDeshabilitarCargaAuto.getSelectedIndices()
      if (arrayIndex.length > 0) {
          var values = []
          arrayIndex.map(function(indexRow) {
            var keysForDelete = oTableDeshabilitarCargaAuto.getModel().oData.modelData[indexRow]
            values.push(keysForDelete.ID_DESACTIVAR_CARGA)
          })
          if (values.length > 0) {
              if (true) {
                  $.ajax({
                    "url": SERVER+'deleteAnyTable.xsjs/',
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    type: "POST",
                    "data": JSON.stringify({
                      pk: {name: 'ID_DESACTIVAR_CARGA', value: values},
                      name: 'DESACTIVAR_CARGA',
                      schema: 'DATO_MAESTRO_ADMIN' 
                    }),
                    "success": function(data) {
                      var responseJson = {}
                      if (typeof(data) == 'String') {
                        responseJson = JSON.parse(data);
                      } else {
                        responseJson = data  
                      }
                      getDeshabilitarCargaAuto();
                      oDialogoConfirmaEliminacionDeshabilitarCargaAuto.close()
                    },
                    "error": function(){
                      logout()
                    },
                    "complete": function() {
                      //location.reload()
                    }
                  });
              }
          }
      } else {
          oDialogoErro.open()
      }
  }
    var oDialogoConfirmaEliminacionDeshabilitarCargaAuto = new sap.m.Dialog(
      {title: 'Error', icon:'sap-icon://error'}
    ).addButton( new sap.m.Button({text: "Aceptar"}).attachPress(function(argument) {
      DeleteDeshabilitarCargaAuto()
    })).addButton( new sap.m.Button({text: "Cerrar"}).attachPress(function(argument) {
      oDialogoConfirmaEliminacionDeshabilitarCargaAuto.close()
    })).addContent(new sap.m.Text({text:' Está seguro de eliminar estos registros '}))
    var oButtonDeleteDeshabilitarCargaAuto = new sap.m.Button({icon:'sap-icon://delete'}).attachPress({}, function() {
      oDialogoConfirmaEliminacionDeshabilitarCargaAuto.open()
    });
    var oBarNewTableDeshabilitarCargaAutoText = new sap.m.Text({text:'Deshabilitar cargas a partir del día'})
    var oBarNewTableDeshabilitarCargaAuto = new sap.m.Bar( {
        contentLeft : [oBarNewTableDeshabilitarCargaAutoText],
        contentMiddle : [],
        contentRight : [oButtonDeleteDeshabilitarCargaAuto]
    });
    var oTableDeshabilitarCargaAuto = new sap.ui.table.Table('oTableDeshabilitarCargaAuto',{
      title: oBarNewTableDeshabilitarCargaAuto,                                   // Displayed as the heading of the table
      selectionMode: sap.ui.table.SelectionMode.MultiToggle,
      enableColumnReordering:true,       // Allows you to drag and drop the column and reorder the position of the column
      width:"100%"                              // width of the table
    }).addColumn(new sap.ui.table.Column({
      width: "250px",
      label: new sap.m.Label({text: "ETL"}),             // Creates an Header with value defined for the text attribute
      template: new sap.m.Text().bindProperty("text", "LABEL"), // binds the value into the text field defined using JSON
      sortProperty: "LABEL",        // enables sorting on the column
      filterProperty: "LABEL",       // enables set filter on the column
    })).addColumn(new sap.ui.table.Column({
      width: "50px",
      label: new sap.m.Label({text: "Día"}),             // Creates an Header with value defined for the text attribute
      template: new sap.m.Text().bindProperty("text", "DIA"), // binds the value into the text field defined using JSON
      sortProperty: "DIA",        // enables sorting on the column
      filterProperty: "DIA",       // enables set filter on the column
    }));
    var oInputDeshabilitarCargaAutoDia = new sap.m.Input("oInputDeshabilitarCargaAutoDia", {width: '100%', type: sap.m.InputType.Number}).setPlaceholder('Día')
    var oButtonDeshabilitarCargaAutoDiaAdd = new sap.m.Button('oButtonDeshabilitarCargaAutoDiaAdd', {width: '100%', icon:'sap-icon://add', text: 'Agregar Día'}).attachPress({}, function() {
      addDeshabilitarCargaAuto(oInputFlowgraph.getSelectedKey(), oInputDeshabilitarCargaAutoDia.getValue())
    })
    function getDeshabilitarCargaAuto() {
      $.get(SERVER_MONITOR+"desactivar_carga.xsjs",function(result){
        var model = JSON.parse(result)
        if (!model.error) {
          var oModel = new sap.ui.model.json.JSONModel();        // created a JSON model      
          oModel.setData({modelData: model});                              // Set the data to the model using the JSON object defined already
          oTableDeshabilitarCargaAuto.setModel(oModel);                                                                                  
          oTableDeshabilitarCargaAuto.bindRows("/modelData");
        }
      });
    }
    function addDeshabilitarCargaAuto(etl, day) {
      $.ajax({
        "url": SERVER_MONITOR+'addDeshabilitarCargaAuto.xsjs/',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        type: "POST",
        "data": JSON.stringify({
          day,
          etl
        }),
        "success": function(data) {
          var responseJson = {}
          if (typeof(data) == 'String') {
            responseJson = JSON.parse(data);
          } else {
            responseJson = data  
          }
          DeshabilitarCargaAuto();
        },
        "error": function(){
          logout()
        },
        "complete": function() {
          //location.reload()
        }
      });
    }
    function DeshabilitarCargaAuto(){
      TituloDeLaAplicacion.setText("Deshabilitar Carga Automaticamente")
      getFlowgraph()
      getDeshabilitarCargaAuto()
      oGridBeforeHeader.removeAllContent()
      oGridHeader.removeAllContent()
      oGridBody.removeAllContent()
      oGridinputCheckBox.removeAllContent()
      oGridHeader.addContent(oInputFlowgraph)
      oGridHeader.addContent(oInputDeshabilitarCargaAutoDia)
      oGridHeader.addContent(oButtonDeshabilitarCargaAutoDiaAdd)
      oGridBody.addContent(oTableDeshabilitarCargaAuto)
      oInputFlowgraph.setSelectedKey('0')
      oBar.removeAllContentLeft()
      oBar.addContentLeft(oButtonBack)
      oGridIndexBody.removeAllContent()
    }

    function DeleteEmailNotify(){
      var arrayIndex = oTableEmailNotify.getSelectedIndices()
      if (arrayIndex.length > 0) {
          var values = []
          arrayIndex.map(function(indexRow) {
            var keysForDelete 
            try {
              keysForDelete = oTableEmailNotify.getModel().oData.modelData[oTableEmailNotify.getModel().aBindings[oTableEmailNotify.getModel().aBindings.length-1].aIndices[indexRow]]
            }
            catch(err) {
              keysForDelete = oTableEmailNotify.getModel().oData.modelData[oTableEmailNotify.getModel().aBindings[0].aIndices[indexRow]]
            }
            values.push(keysForDelete.ID_EMAIL)
          })
          if (values.length > 0) {
              if (true) {
                  $.ajax({
                    "url": SERVER+'deleteAnyTable.xsjs/',
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    type: "POST",
                    "data": JSON.stringify({
                      pk: {name: 'ID_EMAIL', value: values},
                      name: 'EMAIL',
                      schema: 'DATO_MAESTRO_ADMIN' 
                    }),
                    "success": function(data) {
                      var responseJson = {}
                      if (typeof(data) == 'String') {
                        responseJson = JSON.parse(data);
                      } else {
                        responseJson = data  
                      }
                      getEmailNotify();
                      oDialogoConfirmaEliminacionEmailNotify.open()
                    },
                    "error": function(){
                      logout()
                    },
                    "complete": function() {
                      //location.reload()
                    }
                  });
              }
          }
      } else {
          oDialogoErro.open()
      }
  }

    var oDialogoConfirmaEliminacionEmailNotify = new sap.m.Dialog(
      {title: 'Error', icon:'sap-icon://error'}
    ).addButton( new sap.m.Button({text: "Aceptar"}).attachPress(function(argument) {
      DeleteEmailNotify()
    })).addButton( new sap.m.Button({text: "Cerrar"}).attachPress(function(argument) {
      oDialogoConfirmaEliminacionEmailNotify.close()
    })).addContent(new sap.m.Text({text:' Está seguro de eliminar estos correos para notificar '}))
    var oButtonDeleteEmailNotify = new sap.m.Button({icon:'sap-icon://delete'}).attachPress({}, function() {
      oDialogoConfirmaEliminacionEmailNotify.open()
    });
    var oBarNewTableEmailNotifyText = new sap.m.Text({text:'Email a Notificar'})
    var oBarNewTableEmailNotify = new sap.m.Bar( {
        contentLeft : [oBarNewTableEmailNotifyText],
        contentMiddle : [],
        contentRight : [oButtonDeleteEmailNotify]
    });
    var oTableEmailNotify = new sap.ui.table.Table('oTableEmailNotify',{
      title: oBarNewTableEmailNotify,                                   // Displayed as the heading of the table
      selectionMode: sap.ui.table.SelectionMode.MultiToggle,
      enableColumnReordering:true,       // Allows you to drag and drop the column and reorder the position of the column
      width:"100%"                              // width of the table
    }).addColumn(new sap.ui.table.Column({
      label: new sap.m.Label({text: "Correo Electrónico"}),             // Creates an Header with value defined for the text attribute
      template: new sap.m.Text().bindProperty("text", "EMAIL"), // binds the value into the text field defined using JSON
      sortProperty: "EMAIL",        // enables sorting on the column
      filterProperty: "EMAIL",       // enables set filter on the column
    }));
    var oInputEmailNotifyDia = new sap.m.Input("oInputEmailNotifyDia", {width: '100%', type: sap.m.InputType.Email}).setPlaceholder('Correo Electrónico')
    var oButtonEmailNotifyDiaAdd = new sap.m.Button('oButtonEmailNotifyDiaAdd', {width: '100%', icon:'sap-icon://add', text: 'Agregar Correo Electrónico para ser Notificado'}).attachPress({}, function() {
      addEmailNotify(oInputEmailNotifyDia.getValue())
    })
    function getEmailNotify() {
      $.get(SERVER_MONITOR+"email_notify.xsjs",function(result){
        var model = JSON.parse(result)
        if (!model.error) {
          var oModel = new sap.ui.model.json.JSONModel();        // created a JSON model      
          oModel.setData({modelData: model});                              // Set the data to the model using the JSON object defined already
          oTableEmailNotify.setModel(oModel);                                                                                  
          oTableEmailNotify.bindRows("/modelData");
        }
      });
    }
    function addEmailNotify(email) {
      $.ajax({
        "url": SERVER_MONITOR+'addEmailNotify.xsjs/',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        type: "POST",
        "data": JSON.stringify({
          email,
        }),
        "success": function(data) {
          var responseJson = {}
          if (typeof(data) == 'String') {
            responseJson = JSON.parse(data);
          } else {
            responseJson = data  
          }
          getEmailNotify();
        },
        "error": function(){
          logout()
        },
        "complete": function() {
          //location.reload()
        }
      });
    }

    function DeleteEmailAdmin(){
      console.log(oTableEmailAdmin);
      var arrayIndex = oTableEmailAdmin.getSelectedIndices()
      if (arrayIndex.length > 0) {
          var values = []
          arrayIndex.map(function(indexRow) {
            var keysForDelete
            try {
              keysForDelete = oTableEmailAdmin.getModel().oData.modelData[oTableEmailAdmin.getModel().aBindings[oTableEmailAdmin.getModel().aBindings.length-1].aIndices[indexRow]]
            }
            catch(err) {
              keysForDelete = oTableEmailAdmin.getModel().oData.modelData[oTableEmailAdmin.getModel().aBindings[0].aIndices[indexRow]]
            }
            values.push(keysForDelete.ID)
          })
          if (values.length > 0) {
              if (true) {
                $.ajax({
                  "url": SERVER+'deleteAnyTable.xsjs/',
                  contentType: "application/json; charset=utf-8",
                  dataType: "json",
                  type: "POST",
                  "data": JSON.stringify({
                    pk: {name: 'ID', value: values},
                    name: 'ADMIND_USER',
                    schema: 'DATO_MAESTRO_ADMIN' 
                  }),
                  "success": function(data) {
                    var responseJson = {}
                    if (typeof(data) == 'String') {
                      responseJson = JSON.parse(data);
                    } else {
                      responseJson = data  
                    }
                    getEmailAdmin();
                    oDialogoConfirmaEliminacionEmailAdmin.close()
                  },
                  "error": function(){
                    logout()
                  },
                  "complete": function() {
                    //location.reload()
                  }
                });
              }
          }
      } else {
          oDialogoErro.open()
      }
  }
    var oDialogoConfirmaEliminacionEmailAdmin = new sap.m.Dialog(
      {title: 'Error', icon:'sap-icon://error'}
    ).addButton( new sap.m.Button({text: "Aceptar"}).attachPress(function(argument) {
      DeleteEmailAdmin()
    })).addButton( new sap.m.Button({text: "Cerrar"}).attachPress(function(argument) {
      oDialogoConfirmaEliminacionEmailAdmin.close()
    })).addContent(new sap.m.Text({text:' Está seguro de eliminar estos correos como administradores '}))
    var oButtonDeleteEmailAdmin = new sap.m.Button({icon:'sap-icon://delete'}).attachPress({}, function() {
      oDialogoConfirmaEliminacionEmailAdmin.open()
    });
    var oBarNewTableEmailAdminText = new sap.m.Text({text:'Email Administrador'})
    var oBarNewTableEmailAdmin = new sap.m.Bar( {
        contentLeft : [oBarNewTableEmailAdminText],
        contentMiddle : [],
        contentRight : [oButtonDeleteEmailAdmin]
    });
    var oTableEmailAdmin = new sap.ui.table.Table('oTableEmailAdmin',{
      title: oBarNewTableEmailAdmin,                                   // Displayed as the heading of the table
      selectionMode: sap.ui.table.SelectionMode.MultiToggle,
      enableColumnReordering:true,       // Allows you to drag and drop the column and reorder the position of the column
      width:"100%"                              // width of the table
    }).addColumn(new sap.ui.table.Column({
      label: new sap.m.Label({text: "Correo Electrónico"}),             // Creates an Header with value defined for the text attribute
      template: new sap.m.Text().bindProperty("text", "USER"), // binds the value into the text field defined using JSON
      sortProperty: "USER",        // enables sorting on the column
      filterProperty: "USER",       // enables set filter on the column
    }));
    var oInputEmailAdminDia = new sap.m.Input("oInputEmailAdminDia", {width: '100%', type: sap.m.InputType.Email}).setPlaceholder('Correo Electrónico')
    var oButtonEmailAdminDiaAdd = new sap.m.Button('oButtonEmailAdminDiaAdd', {width: '100%', icon:'sap-icon://add', text: 'Asignar Como Administrador'}).attachPress({}, function() {
      addEmailAdmin(oInputEmailNotifyDia.getValue())
    })
    function getEmailAdmin() {
      $.get(SERVER_MONITOR+"email_admin.xsjs",function(result){
        var model = JSON.parse(result)
        if (!model.error) {
          var oModel = new sap.ui.model.json.JSONModel();        // created a JSON model      
          oModel.setData({modelData: model});                              // Set the data to the model using the JSON object defined already
          oTableEmailAdmin.setModel(oModel);                                                                                  
          oTableEmailAdmin.bindRows("/modelData");
        }
      });
    }
    function addEmailAdmin(email) {
      $.ajax({
        "url": SERVER_MONITOR+'addEmailAdmin.xsjs/',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        type: "POST",
        "data": JSON.stringify({
          email: email.toUpperCase(),
        }),
        "success": function(data) {
          var responseJson = {}
          if (typeof(data) == 'String') {
            responseJson = JSON.parse(data);
          } else {
            responseJson = data  
          }
          getEmailAdmin();
        },
        "error": function(){
          logout()
        },
        "complete": function() {
          //location.reload()
        }
      });
    }

    function EmailNotify(){
      TituloDeLaAplicacion.setText("Notificaciones y Usuarios Administradores")
      getEmailNotify()
      getEmailAdmin()
      oGridBeforeHeader.removeAllContent()
      oGridHeader.removeAllContent()
      oGridBody.removeAllContent()
      oGridinputCheckBox.removeAllContent()
      oGridBeforeHeader.addContent(oInputEmailNotifyDia)
      oGridHeader.addContent(oButtonEmailNotifyDiaAdd)
      oGridHeader.addContent(oButtonEmailAdminDiaAdd)
      oGridHeader.addContent(oTableEmailNotify)
      oGridHeader.addContent(oTableEmailAdmin)
      oInputFlowgraph.setSelectedKey('0')
      oBar.removeAllContentLeft()
      oBar.addContentLeft(oButtonBack)
      oGridIndexBody.removeAllContent()
    }


    var OFullConten = new sap.ui.layout.DynamicSideContent('OFullConten', {showSideContent: false, sideContentVisibility: sap.ui.layout.SideContentVisibility.AlwaysShow, sideContentPosition: sap.ui.layout.SideContentPosition.Begin}).addMainContent(oGridBeforeHeader).addMainContent(oGridHeader).addMainContent(oGridBody).addMainContent(oGridIndexBody).addSideContent(oSideBar)
    var oPage = new sap.m.Page({
      content: OFullConten,
    });
    var oBarFooter = new sap.m.Bar( {
       contentLeft : [],
       contentMiddle : [],
       contentRight : [new sap.m.Button('logout', {text: 'logout'}).attachPress({}, function() {
          logout()
        })]
    });
    oPage.setCustomHeader(oBar);
    oPage.setFooter(oBarFooter);

    var app = new sap.m.App("myApp", {
      initialPage: "oPage"
    });
    app.addPage(oPage);

    return app;
  }

});