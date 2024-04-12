import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
  Box,
  Flex,
  Text,
  Image,
  Spinner,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Web3Button, useContract, useNFTs } from "@thirdweb-dev/react";
import { HOUSE_NFT_COLLECTION_ADDRESS } from "../const/addresses";
import { GrPrevious, GrNext } from "react-icons/gr";
import {useToast} from "@chakra-ui/react"

export default function MintHouseModal() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { contract } = useContract(HOUSE_NFT_COLLECTION_ADDRESS);
  const { data, isLoading } = useNFTs(contract);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentHouse, setHouse] = useState();
  const toast = useToast();

  const handleNext = () => {
    setCurrentIndex((prevIndex) => prevIndex + 1);
  };

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) => prevIndex - 1);
  };

  useEffect(() => {
    onOpen();
    if (data) {
      setHouse(data[currentIndex]);
    }
  }, [onOpen, data, currentIndex]);

  return (
    <>
      <Modal onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay backdropFilter="blur(5px)" />
        <ModalContent bg={"#18181a"}>
          <ModalHeader color={"white"}>Pick Your Zurahouse</ModalHeader>
          <ModalCloseButton color={"white"} />
          <ModalBody>
            <Box borderRadius={"8px"} overflow={"hidden"}>
              <Image src={currentHouse?.metadata?.image} />
            </Box>
            <Box mt={2}>
              <Text fontSize={"20px"} color={"white"}>
                {currentHouse?.metadata?.name}
              </Text>
            </Box>
            <Flex align={"center"} mt={7} justify={"space-around"}>
              <Button
                w={"50px"}
                h={"50px"}
                borderRadius={"50%"}
                onClick={handlePrevious}
                bg={"blue"}
                color={"white"}
                isDisabled={currentIndex === 0}
              >
                <GrPrevious />
              </Button>
              {contract && (
                <Web3Button
                  style={{ color: "white", background: "blue" }}
                  contractAddress={HOUSE_NFT_COLLECTION_ADDRESS}
                  action={(contract) =>
                    contract.erc1155.claim(currentHouse?.metadata?.id, 1)
                  }
                  onSuccess={() =>
                    toast({
                      title: `claimed successfully!`,
                      status: "success",
                      isClosable: true,
                    })
                  }
                  onError={(e) => {
                    toast({
                      title: `Error: ${e.message}`,
                      status: "error",
                      isClosable: true,
                    });
                  }}
                >
                  Claim
                </Web3Button>
              )}
              <Button
                w={"50px"}
                h={"50px"}
                bg={"blue"}
                color={"white"}
                borderRadius={"50%"}
                onClick={handleNext}
                isDisabled={currentIndex === data?.length - 1}
              >
                <GrNext />
              </Button>
            </Flex>
          </ModalBody>
          <ModalFooter></ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
