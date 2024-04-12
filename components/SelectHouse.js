// import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
// import { Carousel } from "react-responsive-carousel";
// import { Box, Flex } from "@chakra-ui/react";
// import { ThirdwebNftMedia, useContract, useNFTs } from "@thirdweb-dev/react";
// import { HOUSE_NFT_COLLECTION_ADDRESS } from "../const/addresses";

// export const SelectHouse = () => {
//   const { contract } = useContract(HOUSE_NFT_COLLECTION_ADDRESS);
//   const { data, isLoading, error } = useNFTs(contract);

//   return (
//     <Box
//       borderRadius={"10px"}
//       overflow={"hidden"}
//       display={"flex"}
//       border={"1px solid #841414"}
//     >
//       <Carousel showStatus={false} swipeable={true} width={"100%"}>
//         {data &&
//           data.map((e) => {
//             return (
//               <Flex>
//                 <Box>
//                   <ThirdwebNftMedia
//                     metadata={e?.metadata}
//                     height={"100%"}
//                     width={"100%"}
//                   />
//                   <p className="legend">{e?.metadata?.name}</p>
//                 </Box>
//               </Flex>
//             );
//           })}
//       </Carousel>
//     </Box>
//   );
// };
