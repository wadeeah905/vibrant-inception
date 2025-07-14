xmlport 50080 "Update Extension"
{
    FormatEvaluate = Xml;
    Format = Xml;
    UseDefaultNamespace = true;
    schema
    {
        textelement("extension-values")
        {
            XmlName = 'ExtensionUpdateXML';
            MinOccurs = Zero;
            textelement(extension)
            {
                textelement("table-name")
                {

                }
                textelement("table-key")
                {

                }
                textelement("column-name")
                {
                }
                textelement("value")
                {

                }
                trigger OnAfterAssignVariable()
                begin
                    SetExtEnsionUpdate("table-name", "column-name", "value", "table-key");
                end;

            }

        }
    }
    procedure GetTableID(tablename: text): Integer
    var
        Myrecordref: RecordRef;
        RecGAllObject: Record AllObj;
        TableID: Integer;
    begin

        RecGAllObject.SetRange("Object Name", tablename);
        if RecGAllObject.FindFirst() then;
        TableID := RecGAllObject."Object ID";
        exit(TableID);

    end;

    procedure GetFieldID(columName: text; tablename: Text): Integer
    var
        MyFieldRef: FieldRef;
        RecGAllField: Record "Field";
        FieldID: Integer;
    begin

        RecGAllField.SetRange(TableName, tablename);
        RecGAllField.SetRange(FieldName, columName);
        if RecGAllField.FindFirst() then;
        FieldID := RecGAllField."No.";
        exit(FieldID);

    end;


    procedure SetExtEnsionUpdate(tablename: text; columName: text; val: text; tableKey: Text)
    var
        Myrecordref: RecordRef;
        MyFieldref: FieldRef;
        myrecordid: RecordId;

        valDatetime: DateTime;
        valTime: Time;
        valdate: Date;
    begin
        Evaluate(myrecordid, tablename + ':' + tableKey);

        Myrecordref.Open(GetTableID(tablename));
        Myrecordref.Get(myrecordid);

        MyFieldref := Myrecordref.Field(1);
        if MyFieldref.Active then begin
            MyFieldref := Myrecordref.Field(GetFieldID(columName, tablename));

            case MyFieldref.Type of
                Myfieldref.Type::DateTime:
                    begin
                        Evaluate(valDatetime, val);
                        MyFieldref.Validate(valDatetime);
                        Myrecordref.Modify();
                    end;
                Myfieldref.Type::Date:
                    begin
                        Evaluate(valdate, val);
                        MyFieldref.Validate(valdate);
                        Myrecordref.Modify();
                    end;
                Myfieldref.Type::Time:
                    begin
                        Evaluate(valTime, val);
                        MyFieldref.Validate(valTime);
                        Myrecordref.Modify();
                    end
                else
                    MyFieldref.Validate(val);
                    Myrecordref.Modify();

            end;

        end;
        Myrecordref.Close();
    end;

}
