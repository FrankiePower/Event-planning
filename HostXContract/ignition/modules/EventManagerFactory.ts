import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";


const EventManagerFactoryModule = buildModule("EventManagerFactoryModule", (m) => {
 

  const EventManagerFactory = m.contract("EventManagerFactory", [], {
    
  });

  return { EventManagerFactory };
});

export default EventManagerFactoryModule;
