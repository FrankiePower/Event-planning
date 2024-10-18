export const CONTRACT_ADDRESS = "0x92c721f2db5fa4cb0a77338bb6076aadf00237a8";

export const FactoryABI = [
  {
    inputs: [
      {
        internalType: "address",
        name: "paymentTokenAddress",
        type: "address",
      },
      {
        internalType: "string",
        name: "_NftTokenName",
        type: "string",
      },
      {
        internalType: "string",
        name: "_NftSymbol",
        type: "string",
      },
      {
        internalType: "string",
        name: "_name",
        type: "string",
      },
      {
        internalType: "string",
        name: "_description",
        type: "string",
      },
      {
        internalType: "string",
        name: "_venue",
        type: "string",
      },
      {
        internalType: "string",
        name: "_image",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "_startDate",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_endDate",
        type: "uint256",
      },
      {
        internalType: "uint16",
        name: "_totalTicketAvailable",
        type: "uint16",
      },
    ],
    name: "createEvent",
    outputs: [
      {
        internalType: "contract EventContract",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
];

export const FactoryEventABI = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "eventId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "organizer",
        type: "address",
      },
      {
        indexed: false,
        internalType: "string",
        name: "name",
        type: "string",
      },
      {
        indexed: false,
        internalType: "string",
        name: "description",
        type: "string",
      },
      {
        indexed: false,
        internalType: "string",
        name: "venue",
        type: "string",
      },
      {
        indexed: false,
        internalType: "string",
        name: "image",
        type: "string",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "startDate",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "endDate",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint16",
        name: "totalTicketAvailable",
        type: "uint16",
      },
    ],
    name: "EventCreated",
    type: "event",
  },
];
