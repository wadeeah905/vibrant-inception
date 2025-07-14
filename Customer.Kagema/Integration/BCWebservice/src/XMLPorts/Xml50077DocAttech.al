xmlport 50077 "XmlPortDocAttache"
{
    FormatEvaluate = Xml;
    UseDefaultNamespace = true;
    Format = Xml;
    schema
    {
        textelement(AttacheObject)
        {
            MinOccurs = Zero;
            textelement(AttacheFile)
            {
                MinOccurs = Zero;
                textelement(tableName)
                {

                }
                textelement(documentType)
                {

                }
                textelement(documentNo)
                {

                }
                textelement(Links)
                {
                    textelement(Link)
                    {
                        textelement(LinkURL)
                        {

                        }
                        textelement(Description)
                        {

                        }
                        textelement(IdUser)
                        {

                        }
                        trigger OnAfterAssignVariable()
                        var
                        begin
                            AttachedFile(tableName, documentType, documentNo, LinkURL, Description, IdUser);
                        end;
                    }

                }
            }


        }
    }



    procedure AttachedFile(tableName: Text; documentType: Text; documentNo: Text;
     linkUrl: text; desc: Text; iduser: Text)
    var
        RecServicesHeader: Record "Service Header";
        RecordIDLink: RecordId;
        recordLinkRef: RecordRef;
    begin
        RecServicesHeader.Get(RecServicesHeader."Document Type"::Order, documentNo);
        RecordIDLink := RecServicesHeader.RecordId;
        //Evaluate(RecordIDLink, tableName + ',' + documentType + ',' + documentNo);
        recordLinkRef.Open(GetTableID(tableName));
        recordLinkRef.Get(RecordIDLink);
        recordLinkRef.AddLink(linkUrl, desc);

    end;

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
}

