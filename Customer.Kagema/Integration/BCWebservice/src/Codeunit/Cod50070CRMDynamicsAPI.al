codeunit 50070 CRMDynamicsAPI
{
    procedure UpdateServiceOrders(
     XmlExtensionUpdate: XmlPort "Update Extension";
     XmlServicesItemLine: xmlport "Service Item Line";
     XmlServicesLine: xmlport "Service Line"
    ) ErrorText: Text
    var
    begin

        exit(SetCompleteXMLToImport(
                                    XmlExtensionUpdate
                                    , XmlServicesItemLine
                                    , XmlServicesLine

             ));
        // Then
        //     exit(true)
        //  else
        //    exit(False);

        //  exit(true);
    end;

    procedure CreateServiceOrders(
          XmlServiceHeader: xmlport "Services order Header";
   XmlServicesItemLine: xmlport "Service Item Line";
   XmlServicesLine: xmlport "Service Line"
  ) ErrorText: Text
    var
    begin


        If XmlServiceHeader.Import() then begin
            if NOT XmlServicesItemLine.Import() then begin

                ErrorText := GetLastErrorText();
            end

            else begin
                if NOT XmlServicesLine.Import() then
                    ErrorText := GetLastErrorText();

            end;
        end
        else begin
            ErrorText := GetLastErrorText();

        end;


    end;

    procedure UpdateExtensionForServiceOrders(var XmlExtensionUpdate: XmlPort "Update Extension"): Boolean
    var
    begin
        XmlExtensionUpdate.Import();
        exit(true);
    end;

    procedure UpdateServiceItemLine(var XmlServicesItemLine: xmlport "Service Item Line")
    var
    begin
        XmlServicesItemLine.Import();
    end;

    procedure UpdateServiceLine(var XmlServicesLine: xmlport "Service Line")
    var
    begin
        if
        XmlServicesLine.Import() then;
    end;

    procedure UpdateDocAttachment(var XMLDocAttachment: xmlport "XmlPortDocAttache")
    var
    begin

        XMLDocAttachment.Import();
    end;

    // procedure GetMaterialInventory(ItemNo: code[20]; LocationCode: code[20]): Integer
    // var
    //     RecLItem: Record Item;
    // begin
    //     RecLItem.Get(ItemNo);
    //     RecLItem.SetFilter("Location Filter", LocationCode);
    //     RecLItem.CalcFields(Inventory);
    //     exit(RecLItem.Inventory);
    // end;

    local procedure SetCompleteXMLToImport(
    var XMLExtensionUpdate: xmlport "Update Extension";
    var XmlServicesItemLine: xmlport "Service Item Line";
    var XmlServicesLine: xmlport "Service Line"


    ) ErrorText: Text

    begin
        If XMLExtensionUpdate.Import() then begin
            if XmlServicesItemLine.Import() then begin
                if NOT XmlServicesLine.Import() then
                    ErrorText := 'serviceLine' + GetLastErrorText();
            end


            else begin
                ErrorText := 'service item line' + GetLastErrorText();

            end;
        end
        else begin
            ErrorText := 'extension update' + GetLastErrorText();


        end;


        exit(ErrorText);




    end;


    procedure UpdateServiceCommentLine(var XmlServiceCommentLine: xmlport "ServiceCommentLine")
    var
    begin
        XmlServiceCommentLine.Import();

    end;
}
