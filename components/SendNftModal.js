import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Box,
  Input,
  useDisclosure,
  Button,
  FormControl,
  FormLabel,
  useToast,
  Spinner,
  Flex,
  Text,
  Skeleton,
  Image,
} from "@chakra-ui/react";
import {
  Web3Button,
  useContract,
  useTransferNFT,
  useAddress,
  usePersonalWalletAddress,
} from "@thirdweb-dev/react";
import { HASH_NFT_COLLECTION_ADDRESS } from "../const/addresses";

export function SendNftModal(data) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const initialRef = React.useRef(null);
  const finalRef = React.useRef(null);
  const toast = useToast();
  const { contract } = useContract(HASH_NFT_COLLECTION_ADDRESS);
  const [toWallet, setToWallet] = useState();
  const address = useAddress();
  const {
    mutateAsync: transferNFT,
    isLoading,
    error,
    status,
  } = useTransferNFT(contract);

  useEffect(() => {
    if (status === "success") {
      toast({
        title: `trasnfer success 😊`,
        status: "success",
        isClosable: true,
      });
    }
  }, [status]);

  console.log(error)

  return (
    <>
      <Button
        onClick={onOpen}
        bg={"#654E30"}
        boxShadow={
          "box-shadow: rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset"
        }
        color={"white"}
        fontWeight={400}
      >
        {"Send NFT"}
      </Button>

      <Modal
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}
        isOpen={isOpen}
        onClose={onClose}
        motionPreset="slideInBottom"
        isCentered
      >
        <ModalOverlay backdropFilter="blur(8px)" />
        <ModalContent color={"white"} bg={"#131418"}>
          <ModalHeader>Send NFT to Wallet</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <>
              <FormControl>
                <FormLabel>Nft Details</FormLabel>
                <Flex
                  gap={2}
                  p={4}
                  border={"1px solid white"}
                  borderRadius={"5px"}
                >
                  <Box>
                    <Image
                      src={data?.data?.image}
                      width={"60px"}
                      height={"60px"}
                      alt="logo"
                    />
                  </Box>
                  <Box>
                    <Text>{`Name : ${data?.data?.name}`}</Text>
                    <Text color={"grey"}>{`Id : ${data?.data?.id}`}</Text>
                  </Box>
                </Flex>
              </FormControl>
              <FormControl mt={4}>
                <FormLabel>Send To</FormLabel>
                <Input
                  placeholder="0x..."
                  onChange={(e) => setToWallet(e.target.value)}
                />
              </FormControl>
            </>
          </ModalBody>

          <ModalFooter>
            <Web3Button
              style={{ color: "white", background: "#0000FF", width: "100%" }}
              contractAddress={HASH_NFT_COLLECTION_ADDRESS}
              action={() => {
                transferNFT({
                  to: toWallet,
                  tokenId: data?.data?.id,
                  amount: 1,
                });
              }}
            >
              {status === "loading" ? <Spinner /> : "Send"}
            </Web3Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
