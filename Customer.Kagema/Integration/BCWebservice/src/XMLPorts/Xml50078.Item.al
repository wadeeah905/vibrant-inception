xmlport 50078 "Xml Item"
{
    FormatEvaluate = Xml;
    UseDefaultNamespace = true;

    schema
    {
        textelement(ItemXML)
        {
            XmlName = 'Item';
            tableelement(item; "Item")
            {
                XmlName = 'Item';
                //UseTemporary=true
                LinkTableForceInsert = true;
                MaxOccurs = Once;
                AutoUpdate = true;
                AutoSave = true;
                fieldelement(No; item."No.")
                {
                    MinOccurs = Zero;
                }
                fieldelement(AllowInvoiceDisc; item."Allow Invoice Disc.")
                {
                    MinOccurs = Zero;
                }
                fieldelement(AllowOnlineAdjustment; item."Allow Online Adjustment")
                {
                    MinOccurs = Zero;
                }
                fieldelement(AlternativeItemNo; item."Alternative Item No.")
                {
                    MinOccurs = Zero;
                }
                fieldelement(ApplicationWkshUserID; item."Application Wksh. User ID")
                {
                    MinOccurs = Zero;
                }
                fieldelement(AssemblyBOM; item."Assembly BOM")
                {
                    MinOccurs = Zero;
                }
                fieldelement(AssemblyPolicy; item."Assembly Policy")
                {
                    MinOccurs = Zero;
                }
                fieldelement(AutomaticExtTexts; item."Automatic Ext. Texts")
                {
                    MinOccurs = Zero;
                }
                fieldelement(BaseUnitofMeasure; item."Base Unit of Measure")
                {
                    MinOccurs = Zero;
                }
                /* fieldelement(BinFilter; item."Bin Filter")
                 {
                     MinOccurs = Zero;
                 }*/
                fieldelement(BlockReason; item."Block Reason")
                {
                    MinOccurs = Zero;
                }
                fieldelement(BudgetProfit; item."Budget Profit")
                {
                    MinOccurs = Zero;
                }
                fieldelement(BudgetQuantity; item."Budget Quantity")
                {
                    MinOccurs = Zero;
                }
                fieldelement(BudgetedAmount; item."Budgeted Amount")
                {
                    MinOccurs = Zero;
                }
                fieldelement(COGSLCY; item."COGS (LCY)")
                {
                    MinOccurs = Zero;
                }
                fieldelement(CommissionGroup; item."Commission Group")
                {
                    MinOccurs = Zero;
                }
                fieldelement(CommonItemNo; item."Common Item No.")
                {
                    MinOccurs = Zero;
                }
                fieldelement(ComponentForecast; item."Component Forecast")
                {
                    MinOccurs = Zero;
                }
                fieldelement(CostisAdjusted; item."Cost is Adjusted")
                {
                    MinOccurs = Zero;
                }
                fieldelement(CostisPostedtoGL; item."Cost is Posted to G/L")
                {
                    MinOccurs = Zero;
                }
                fieldelement(CostofOpenProductionOrders; item."Cost of Open Production Orders")
                {
                    MinOccurs = Zero;
                }
                fieldelement(CostingMethod; item."Costing Method")
                {
                    MinOccurs = Zero;
                }
                fieldelement(CountryRegionofOriginCode; item."Country/Region of Origin Code")
                {
                    MinOccurs = Zero;
                }
                fieldelement(CountryRegionPurchasedCode; item."Country/Region Purchased Code")
                {
                    MinOccurs = Zero;
                }
                fieldelement(CreatedFromNonstockItem; item."Created From Nonstock Item")
                {
                    MinOccurs = Zero;
                }
                fieldelement(DampenerPeriod; item."Dampener Period")
                {
                    MinOccurs = Zero;
                }
                fieldelement(DampenerQuantity; item."Dampener Quantity")
                {
                    MinOccurs = Zero;
                }
                /*fieldelement(DateFilter; item."Date Filter")
                {
                    MinOccurs = Zero;
                }*/
                fieldelement(DefaultDeferralTemplateCode; item."Default Deferral Template Code")
                {
                    MinOccurs = Zero;
                }
                fieldelement(Description2; item."Description 2")
                {
                    MinOccurs = Zero;
                }
                fieldelement(DiscreteOrderQuantity; item."Discrete Order Quantity")
                {
                    MinOccurs = Zero;
                }
                /*fieldelement(DropShipmentFilter; item."Drop Shipment Filter")
                {
                    MinOccurs = Zero;
                }*/
                fieldelement(DutyCode; item."Duty Code")
                {
                    MinOccurs = Zero;
                }
                fieldelement(DutyDue; item."Duty Due %")
                {
                    MinOccurs = Zero;
                }
                fieldelement(DutyUnitConversion; item."Duty Unit Conversion")
                {
                    MinOccurs = Zero;
                }
                fieldelement(ExpirationCalculation; item."Expiration Calculation")
                {
                    MinOccurs = Zero;
                }
                fieldelement(FlushingMethod; item."Flushing Method")
                {
                    MinOccurs = Zero;
                }
                fieldelement(FPOrderReceiptQty; item."FP Order Receipt (Qty.)")
                {
                    MinOccurs = Zero;
                }
                fieldelement(FreightType; item."Freight Type")
                {
                    MinOccurs = Zero;
                }
                fieldelement(GenProdPostingGroup; item."Gen. Prod. Posting Group")
                {
                    MinOccurs = Zero;
                }
                fieldelement(GlobalDimension1Code; item."Global Dimension 1 Code")
                {
                    MinOccurs = Zero;
                }
                fieldelement(GlobalDimension1Filter; item."Global Dimension 1 Filter")
                {
                    MinOccurs = Zero;
                }
                fieldelement(GlobalDimension2Code; item."Global Dimension 2 Code")
                {
                    MinOccurs = Zero;
                }
                fieldelement(GlobalDimension2Filter; item."Global Dimension 2 Filter")
                {
                    MinOccurs = Zero;
                }
                fieldelement(GrossWeight; item."Gross Weight")
                {
                    MinOccurs = Zero;
                }
                fieldelement(IdentifierCode; item."Identifier Code")
                {
                    MinOccurs = Zero;
                }
                fieldelement(IncludeInventory; item."Include Inventory")
                {
                    MinOccurs = Zero;
                }
                fieldelement(IndirectCost; item."Indirect Cost %")
                {
                    MinOccurs = Zero;
                }
                fieldelement(InventoryPostingGroup; item."Inventory Posting Group")
                {
                    MinOccurs = Zero;
                }
                fieldelement(InventoryValueZero; item."Inventory Value Zero")
                {
                    MinOccurs = Zero;
                }
                fieldelement(ItemCategoryCode; item."Item Category Code")
                {
                    MinOccurs = Zero;
                }
                fieldelement(ItemCategoryId; item."Item Category Id")
                {
                    MinOccurs = Zero;
                }
                fieldelement(ItemDiscGroup; item."Item Disc. Group")
                {
                    MinOccurs = Zero;
                }
                fieldelement(ItemTrackingCode; item."Item Tracking Code")
                {
                    MinOccurs = Zero;
                }
                fieldelement(LastCountingPeriodUpdate; item."Last Counting Period Update")
                {
                    MinOccurs = Zero;
                }
                /*fieldelement(LastDateModified; item."Last Date Modified")
                {
                    MinOccurs = Zero;
                }
                fieldelement(LastDateTimeModified; item."Last DateTime Modified")
                {
                    MinOccurs = Zero;
                }
                fieldelement(LastDirectCost; item."Last Direct Cost")
                {
                    MinOccurs = Zero;
                }
                fieldelement(LastPhysInvtDate; item."Last Phys. Invt. Date")
                {
                    MinOccurs = Zero;
                }
                fieldelement(LastTimeModified; item."Last Time Modified")
                {
                    MinOccurs = Zero;
                }
                fieldelement(LastUnitCostCalcDate; item."Last Unit Cost Calc. Date")
                {
                    MinOccurs = Zero;
                }*/
                fieldelement(LeadTimeCalculation; item."Lead Time Calculation")
                {
                    MinOccurs = Zero;
                }
                /*fieldelement(LocationFilter; item."Location Filter")
                {
                    MinOccurs = Zero;
                }*/
                fieldelement(LotAccumulationPeriod; item."Lot Accumulation Period")
                {
                    MinOccurs = Zero;
                }
                /*fieldelement(LotNoFilter; item."Lot No. Filter")
                {
                    MinOccurs = Zero;
                }*/
                fieldelement(LotNos; item."Lot Nos.")
                {
                    MinOccurs = Zero;
                }
                fieldelement(LotSize; item."Lot Size")
                {
                    MinOccurs = Zero;
                }
                fieldelement(LowLevelCode; item."Low-Level Code")
                {
                    MinOccurs = Zero;
                }
                fieldelement(ManufacturerCode; item."Manufacturer Code")
                {
                    MinOccurs = Zero;
                }
                fieldelement(ManufacturingPolicy; item."Manufacturing Policy")
                {
                    MinOccurs = Zero;
                }
                fieldelement(MaximumInventory; item."Maximum Inventory")
                {
                    MinOccurs = Zero;
                }
                fieldelement(MaximumOrderQuantity; item."Maximum Order Quantity")
                {
                    MinOccurs = Zero;
                }
                fieldelement(MinimumOrderQuantity; item."Minimum Order Quantity")
                {
                    MinOccurs = Zero;
                }
                /*fieldelement(NegativeAdjmtLCY; item."Negative Adjmt. (LCY)")
                {
                    MinOccurs = Zero;
                }
                fieldelement(NegativeAdjmtQty; item."Negative Adjmt. (Qty.)")
                {
                    MinOccurs = Zero;
                }
                fieldelement(NetChange; item."Net Change")
                {
                    MinOccurs = Zero;
                }
                fieldelement(NetInvoicedQty; item."Net Invoiced Qty.")
                {
                    MinOccurs = Zero;
                }*/
                fieldelement(NetWeight; item."Net Weight")
                {
                    MinOccurs = Zero;
                }
                /*fieldelement(NextCountingEndDate; item."Next Counting End Date")
                {
                    MinOccurs = Zero;
                }
                fieldelement(NextCountingStartDate; item."Next Counting Start Date")
                {
                    MinOccurs = Zero;
                }*/
                fieldelement(No2; item."No. 2")
                {
                    MinOccurs = Zero;
                }
                fieldelement(NoofSubstitutes; item."No. of Substitutes")
                {
                    MinOccurs = Zero;
                }
                fieldelement(NoSeries; item."No. Series")
                {
                    MinOccurs = Zero;
                }

                fieldelement(OrderMultiple; item."Order Multiple")
                {
                    MinOccurs = Zero;
                }
                fieldelement(OrderTrackingPolicy; item."Order Tracking Policy")
                {
                    MinOccurs = Zero;
                }
                fieldelement(OverflowLevel; item."Overflow Level")
                {
                    MinOccurs = Zero;
                }
                fieldelement(OverheadRate; item."Overhead Rate")
                {
                    MinOccurs = Zero;
                }
                fieldelement(PhysInvtCountingPeriodCode; item."Phys Invt Counting Period Code")
                {
                    MinOccurs = Zero;
                }
                /*fieldelement(PlannedOrderReceiptQty; item."Planned Order Receipt (Qty.)")
                {
                    MinOccurs = Zero;
                }
                fieldelement(PlannedOrderReleaseQty; item."Planned Order Release (Qty.)")
                {
                    MinOccurs = Zero;
                }
                fieldelement(PlanningIssuesQty; item."Planning Issues (Qty.)")
                {
                    MinOccurs = Zero;
                }
                fieldelement(PlanningReceiptQty; item."Planning Receipt (Qty.)")
                {
                    MinOccurs = Zero;
                }
                fieldelement(PlanningReleaseQty; item."Planning Release (Qty.)")
                {
                    MinOccurs = Zero;
                }
                fieldelement(PlanningTransferShipQty; item."Planning Transfer Ship. (Qty).")
                {
                    MinOccurs = Zero;
                }
                fieldelement(PlanningWorksheetQty; item."Planning Worksheet (Qty.)")
                {
                    MinOccurs = Zero;
                }
                fieldelement(PositiveAdjmtLCY; item."Positive Adjmt. (LCY)")
                {
                    MinOccurs = Zero;
                }
                fieldelement(PositiveAdjmtQty; item."Positive Adjmt. (Qty.)")
                {
                    MinOccurs = Zero;
                }*/
                fieldelement(PreventNegativeInventory; item."Prevent Negative Inventory")
                {
                    MinOccurs = Zero;
                }
                fieldelement(PriceIncludesVAT; item."Price Includes VAT")
                {
                    MinOccurs = Zero;
                }
                fieldelement(PriceUnitConversion; item."Price Unit Conversion")
                {
                    MinOccurs = Zero;
                }
                fieldelement(PriceProfitCalculation; item."Price/Profit Calculation")
                {
                    MinOccurs = Zero;
                }
                fieldelement(ProdForecastQuantityBase; item."Prod. Forecast Quantity (Base)")
                {
                    MinOccurs = Zero;
                }
                /*fieldelement(ProductGroupCode; item."Product Group Code")
                {
                    MinOccurs=Zero;
                }*/
                fieldelement(ProductionBOMNo; item."Production BOM No.")
                {
                    MinOccurs = Zero;
                }
                fieldelement(ProductionForecastName; item."Production Forecast Name")
                {
                    MinOccurs = Zero;
                }
                fieldelement(Profit; item."Profit %")
                {
                    MinOccurs = Zero;
                }
                /*fieldelement(PurchReqReceiptQty; item."Purch. Req. Receipt (Qty.)")
                {
                    MinOccurs = Zero;
                }
                fieldelement(PurchReqReleaseQty; item."Purch. Req. Release (Qty.)")
                {
                    MinOccurs = Zero;
                }*/
                fieldelement(PurchUnitofMeasure; item."Purch. Unit of Measure")
                {
                    MinOccurs = Zero;
                }
                /*fieldelement(PurchasesLCY; item."Purchases (LCY)")
                {
                    MinOccurs = Zero;
                }
                fieldelement(PurchasesQty; item."Purchases (Qty.)")
                {
                    MinOccurs = Zero;
                }*/
                fieldelement(PurchasingBlocked; item."Purchasing Blocked")
                {
                    MinOccurs = Zero;
                }
                fieldelement(PutawayTemplateCode; item."Put-away Template Code")
                {
                    MinOccurs = Zero;
                }
                fieldelement(PutawayUnitofMeasureCode; item."Put-away Unit of Measure Code")
                {
                    MinOccurs = Zero;
                }
                /*fieldelement(QtyAssignedtoship; item."Qty. Assigned to ship")
                {
                    MinOccurs = Zero;
                }
                fieldelement(QtyinTransit; item."Qty. in Transit")
                {
                    MinOccurs = Zero;
                }
                fieldelement(QtyonAsmComponent; item."Qty. on Asm. Component")
                {
                    MinOccurs = Zero;
                }
                fieldelement(QtyonAssemblyOrder; item."Qty. on Assembly Order")
                {
                    MinOccurs = Zero;
                }
                fieldelement(QtyonComponentLines; item."Qty. on Component Lines")
                {
                    MinOccurs = Zero;
                }
                fieldelement(QtyonJobOrder; item."Qty. on Job Order")
                {
                    MinOccurs = Zero;
                }
                fieldelement(QtyonProdOrder; item."Qty. on Prod. Order")
                {
                    MinOccurs = Zero;
                }
                fieldelement(QtyonPurchOrder; item."Qty. on Purch. Order")
                {
                    MinOccurs = Zero;
                }
                fieldelement(QtyonPurchReturn; item."Qty. on Purch. Return")
                {
                    MinOccurs = Zero;
                }
                fieldelement(QtyonSalesOrder; item."Qty. on Sales Order")
                {
                    MinOccurs = Zero;
                }
                fieldelement(QtyonSalesReturn; item."Qty. on Sales Return")
                {
                    MinOccurs = Zero;
                }
                fieldelement(QtyonServiceOrder; item."Qty. on Service Order")
                {
                    MinOccurs = Zero;
                }
                fieldelement(QtyPicked; item."Qty. Picked")
                {
                    MinOccurs = Zero;
                }
                fieldelement(RelOrderReceiptQty; item."Rel. Order Receipt (Qty.)")
                {
                    MinOccurs = Zero;
                }*/
                fieldelement(ReorderPoint; item."Reorder Point")
                {
                    MinOccurs = Zero;
                }
                fieldelement(ReorderQuantity; item."Reorder Quantity")
                {
                    MinOccurs = Zero;
                }
                fieldelement(ReorderingPolicy; item."Reordering Policy")
                {
                    MinOccurs = Zero;
                }
                fieldelement(ReplenishmentSystem; item."Replenishment System")
                {
                    MinOccurs = Zero;
                }
                /*fieldelement(ResQtyonAsmComp; item."Res. Qty. on  Asm. Comp.")
                {
                    MinOccurs = Zero;
                }
                fieldelement(ResQtyonAssemblyOrder; item."Res. Qty. on Assembly Order")
                {
                    MinOccurs = Zero;
                }
                fieldelement(ResQtyonInboundTransfer; item."Res. Qty. on Inbound Transfer")
                {
                    MinOccurs = Zero;
                }
                fieldelement(ResQtyonJobOrder; item."Res. Qty. on Job Order")
                {
                    MinOccurs = Zero;
                }
                fieldelement(ResQtyonOutboundTransfer; item."Res. Qty. on Outbound Transfer")
                {
                    MinOccurs = Zero;
                }
                fieldelement(ResQtyonProdOrderComp; item."Res. Qty. on Prod. Order Comp.")
                {
                    MinOccurs = Zero;
                }
                fieldelement(ResQtyonPurchReturns; item."Res. Qty. on Purch. Returns")
                {
                    MinOccurs = Zero;
                }
                fieldelement(ResQtyonReqLine; item."Res. Qty. on Req. Line")
                {
                    MinOccurs = Zero;
                }
                fieldelement(ResQtyonSalesReturns; item."Res. Qty. on Sales Returns")
                {
                    MinOccurs = Zero;
                }
                fieldelement(ResQtyonServiceOrders; item."Res. Qty. on Service Orders")
                {
                    MinOccurs = Zero;
                }*/
                fieldelement(ReschedulingPeriod; item."Rescheduling Period")
                {
                    MinOccurs = Zero;
                }
                /*fieldelement(ReservedQtyonInventory; item."Reserved Qty. on Inventory")
                {
                    MinOccurs = Zero;
                }
                fieldelement(ReservedQtyonProdOrder; item."Reserved Qty. on Prod. Order")
                {
                    MinOccurs = Zero;
                }
                fieldelement(ReservedQtyonPurchOrders; item."Reserved Qty. on Purch. Orders")
                {
                    MinOccurs = Zero;
                }
                fieldelement(ReservedQtyonSalesOrders; item."Reserved Qty. on Sales Orders")
                {
                    MinOccurs = Zero;
                }
                fieldelement(RolledupCapOverheadCost; item."Rolled-up Cap. Overhead Cost")
                {
                    MinOccurs = Zero;
                }
                fieldelement(RolledupCapacityCost; item."Rolled-up Capacity Cost")
                {
                    MinOccurs = Zero;
                }
                fieldelement(RolledupMaterialCost; item."Rolled-up Material Cost")
                {
                    MinOccurs = Zero;
                }
                fieldelement(RolledupMfgOvhdCost; item."Rolled-up Mfg. Ovhd Cost")
                {
                    MinOccurs = Zero;
                }
                fieldelement(RolledupSubcontractedCost; item."Rolled-up Subcontracted Cost")
                {
                    MinOccurs = Zero;
                }*/
                fieldelement(RoundingPrecision; item."Rounding Precision")
                {
                    MinOccurs = Zero;
                }
                fieldelement(RoutingNo; item."Routing No.")
                {
                    MinOccurs = Zero;
                }
                fieldelement(SafetyLeadTime; item."Safety Lead Time")
                {
                    MinOccurs = Zero;
                }
                fieldelement(SafetyStockQuantity; item."Safety Stock Quantity")
                {
                    MinOccurs = Zero;
                }
                /* fieldelement(SalesLCY; item."Sales (LCY)")
                 {
                     MinOccurs = Zero;
                 }
                 fieldelement(SalesQty; item."Sales (Qty.)")
                 {
                     MinOccurs = Zero;
                 }*/
                fieldelement(SalesBlocked; item."Sales Blocked")
                {
                    MinOccurs = Zero;
                }
                fieldelement(SalesUnitofMeasure; item."Sales Unit of Measure")
                {
                    MinOccurs = Zero;
                }
                /*fieldelement(ScheduledNeedQty; item."Scheduled Need (Qty.)")
                {
                    MinOccurs = Zero;
                }
                fieldelement(ScheduledReceiptQty; item."Scheduled Receipt (Qty.)")
                {
                    MinOccurs = Zero;
                }*/
                fieldelement(Scrap; item."Scrap %")
                {
                    MinOccurs = Zero;
                }
                fieldelement(SearchDescription; item."Search Description")
                {
                    MinOccurs = Zero;
                }
                /*fieldelement(SerialNoFilter; item."Serial No. Filter")
                {
                    MinOccurs = Zero;
                }*/
                fieldelement(SerialNos; item."Serial Nos.")
                {
                    MinOccurs = Zero;
                }
                fieldelement(ServiceItemGroup; item."Service Item Group")
                {
                    MinOccurs = Zero;
                }
                fieldelement(ShelfNo; item."Shelf No.")
                {
                    MinOccurs = Zero;
                }
                fieldelement(SingleLevelCapOvhdCost; item."Single-Level Cap. Ovhd Cost")
                {
                    MinOccurs = Zero;
                }
                fieldelement(SingleLevelCapacityCost; item."Single-Level Capacity Cost")
                {
                    MinOccurs = Zero;
                }
                fieldelement(SingleLevelMaterialCost; item."Single-Level Material Cost")
                {
                    MinOccurs = Zero;
                }
                fieldelement(SingleLevelMfgOvhdCost; item."Single-Level Mfg. Ovhd Cost")
                {
                    MinOccurs = Zero;
                }
                fieldelement(SingleLevelSubcontrdCost; item."Single-Level Subcontrd. Cost")
                {
                    MinOccurs = Zero;
                }
                fieldelement(SpecialEquipmentCode; item."Special Equipment Code")
                {
                    MinOccurs = Zero;
                }
                fieldelement(StandardCost; item."Standard Cost")
                {
                    MinOccurs = Zero;
                }
                fieldelement(StatisticsGroup; item."Statistics Group")
                {
                    MinOccurs = Zero;
                }
                fieldelement(StockkeepingUnitExists; item."Stockkeeping Unit Exists")
                {
                    MinOccurs = Zero;
                }
                fieldelement(StockoutWarning; item."Stockout Warning")
                {
                    MinOccurs = Zero;
                }
                fieldelement(SubstitutesExist; item."Substitutes Exist")
                {
                    MinOccurs = Zero;
                }
                fieldelement(TariffNo; item."Tariff No.")
                {
                    MinOccurs = Zero;
                }
                fieldelement(TaxGroupCode; item."Tax Group Code")
                {
                    MinOccurs = Zero;
                }
                fieldelement(TaxGroupId; item."Tax Group Id")
                {
                    MinOccurs = Zero;
                }
                fieldelement(TimeBucket; item."Time Bucket")
                {
                    MinOccurs = Zero;
                }
                fieldelement(TransOrdReceiptQty; item."Trans. Ord. Receipt (Qty.)")
                {
                    MinOccurs = Zero;
                }
                fieldelement(TransOrdShipmentQty; item."Trans. Ord. Shipment (Qty.)")
                {
                    MinOccurs = Zero;
                }
                fieldelement(TransferredLCY; item."Transferred (LCY)")
                {
                    MinOccurs = Zero;
                }
                fieldelement(TransferredQty; item."Transferred (Qty.)")
                {
                    MinOccurs = Zero;
                }
                fieldelement(UnitCost; item."Unit Cost")
                {
                    MinOccurs = Zero;
                }
                fieldelement(UnitListPrice; item."Unit List Price")
                {
                    MinOccurs = Zero;
                }
                fieldelement(UnitofMeasureId; item."Unit of Measure Id")
                {
                    MinOccurs = Zero;
                }
                fieldelement(UnitPrice; item."Unit Price")
                {
                    MinOccurs = Zero;
                }
                fieldelement(UnitVolume; item."Unit Volume")
                {
                    MinOccurs = Zero;
                }
                fieldelement(UnitsperParcel; item."Units per Parcel")
                {
                    MinOccurs = Zero;
                }
                fieldelement(UseCrossDocking; item."Use Cross-Docking")
                {
                    MinOccurs = Zero;
                }
                /*fieldelement(VariantFilter; item."Variant Filter")
                {
                    MinOccurs = Zero;
                }*/
                fieldelement(VATBusPostingGrPrice; item."VAT Bus. Posting Gr. (Price)")
                {
                    MinOccurs = Zero;
                }
                fieldelement(VATProdPostingGroup; item."VAT Prod. Posting Group")
                {
                    MinOccurs = Zero;
                }
                fieldelement(VendorItemNo; item."Vendor Item No.")
                {
                    MinOccurs = Zero;
                }
                fieldelement(VendorNo; item."Vendor No.")
                {
                    MinOccurs = Zero;
                }
                fieldelement(WarehouseClassCode; item."Warehouse Class Code")
                {
                    MinOccurs = Zero;
                }
                fieldelement(Blocked; item.Blocked)
                {
                    MinOccurs = Zero;
                }
                fieldelement(Comment; item.Comment)
                {
                    MinOccurs = Zero;
                }
                fieldelement(Critical; item.Critical)
                {
                    MinOccurs = Zero;
                }
                fieldelement(Description; item.Description)
                {
                    MinOccurs = Zero;
                }
                fieldelement(Durability; item.Durability)
                {
                    MinOccurs = Zero;
                }
                fieldelement(GTIN; item.GTIN)
                {
                    MinOccurs = Zero;
                }
                fieldelement(Id; item.Id)
                {
                    MinOccurs = Zero;
                }
                fieldelement(Inventory; item.Inventory)
                {
                    MinOccurs = Zero;
                }
                fieldelement(Picture; item.Picture)
                {
                    MinOccurs = Zero;
                }
                fieldelement(Reserve; item.Reserve)
                {
                    MinOccurs = Zero;
                }
                /* fieldelement(SystemId; item.SystemId)
                 {
                 }*/
                fieldelement(Type; item.Type)
                {
                    MinOccurs = Zero;
                }
            }
        }
    }
    requestpage
    {
        layout
        {
            area(content)
            {
                group(GroupName)
                {
                }
            }
        }
        actions
        {
            area(processing)
            {
            }
        }
    }
}
