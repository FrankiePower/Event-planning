import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const EventManagerFactoryModule = buildModule("EventManagerFactoryModule", (m) => {
  
    // Deploy required libraries
    const EventCreationLib = m.library("EventCreationLib");
    const VendorAgreementLib = m.library("VendorAgreementLib");
    const SponsorAgreementLib = m.library("SponsorAgreementLib");
    const RefundLib = m.library("RefundLib");
    const RevenueDistributionLib = m.library("RevenueDistributionLib");
  
    // TicketLib does not need EventCreationLib
    const TicketLib = m.library("TicketLib"); // Just deploy it without dependencies

    // TicketPurchaseLib depends on TicketLib
    const TicketPurchaseLib = m.library("TicketPurchaseLib", {
        libraries: {
            TicketLib // Ensure TicketLib is linked, since it uses it
        }
    });

    // Deploy EventManagerFactory contract without TicketPurchaseLib
    const EventManagerFactory = m.contract("EventManagerFactory", [], {
        libraries: {
            EventCreationLib,
            TicketLib,
            TicketPurchaseLib, // Link this if EventManagerFactory uses it
            VendorAgreementLib,
            SponsorAgreementLib,
            RefundLib,
            RevenueDistributionLib
        }
    });

    return { EventManagerFactory };
});

export default EventManagerFactoryModule;
