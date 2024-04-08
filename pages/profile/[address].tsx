import {
  Box,
  Button,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  Tooltip,
  VStack,
  Image,
  Alert,
  AlertIcon,
  Progress,
  Spinner,
  Grid,
  CircularProgress,
  CircularProgressLabel,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect, useMemo, useState, useRef } from "react";
import styles from "../../styles/Profile.module.css";
import {
  MARKETPLACE_ADDRESS,
  HASH_NFT_COLLECTION_ADDRESS,
  CONZURA_NFT_COLLECTION_ADDRESS,
  HOUSE_NFT_COLLECTION_ADDRESS,
  KARMA_TOKEN_ADDRESS,
} from "../../const/addresses";
import { useRouter } from "next/navigation";
import {
  ConnectWallet,
  ThirdwebNftMedia,
  shortenIfAddress,
  useClaimToken,
  useContract,
  useDisconnect,
  useOwnedNFTs,
  usePersonalWalletAddress,
  useTokenBalance,
  useTokenDrop,
} from "@thirdweb-dev/react";
import { FaHome } from "react-icons/fa";
import { MdDashboard, MdContactSupport } from "react-icons/md";
import { CopyIcon, Search2Icon } from "@chakra-ui/icons";
import { CgProfile } from "react-icons/cg";
import { FcAbout } from "react-icons/fc";
import { useAddress } from "@thirdweb-dev/react";
import axios from "axios";
import { EditModal } from "../../components/EditModal";
import StatusIndicator from "../../components/StatusIndicator";
import ClaimKarmaModal from "../../components/ClaimKarmaModal";
import { KarmaLevel } from "../../components/KarmaLevel";
import { SendFundModal } from "../../components/SendFundModal";
import { SendNftModal } from "../../components/SendNftModal";

export default function ProfilePage() {
  const router = useRouter();
  const disconnect = useDisconnect();
  const address = useAddress();
  const [currentWallet, setCurrentWallet] = useState<string>("");
  const [currentUser, setUser] = useState<any>();
  const [completionPercentage, setCompletionPercentage] = useState(25);
  const tokenDrop = useTokenDrop(KARMA_TOKEN_ADDRESS);
  const [isClaimmed, setIsClaimmed] = useState(false);
  const { data: tokenBalance } = useTokenBalance(tokenDrop, address);
  const { mutate: claimToken, isLoading: clamming } = useClaimToken(tokenDrop);
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const { contract: nftCollection } = useContract(HASH_NFT_COLLECTION_ADDRESS);
  const toast = useToast();
  const [houseCardColor, setCardColor] = useState("");
  const [userUpdate, setUserUpdate] = useState(false);
  const { contract: nftCollection2 } = useContract(
    CONZURA_NFT_COLLECTION_ADDRESS
  );
  const { contract: nftCollection3 } = useContract(
    HOUSE_NFT_COLLECTION_ADDRESS
  );

  const { contract: marketplace } = useContract(
    MARKETPLACE_ADDRESS,
    "marketplace-v3"
  );

  const { data: hashNfts, isLoading: hashLoading } = useOwnedNFTs(
    nftCollection,
    currentWallet as string
  );

  const { data: conzuraNfts, isLoading: conzuraLoading } = useOwnedNFTs(
    nftCollection2,
    currentWallet as string
  );

  const { data: houseNfts, isLoading: houseLoading } = useOwnedNFTs(
    nftCollection3,
    currentWallet as string
  );

  // merging all NFT's array in one

  interface NFT {
    id: number;
    name: string;
  }

  const redirectToHome = () => {
    if (typeof window !== "undefined") {
      router.push("/");
    }
  };

  // function for setting current value of profile completion

  const updateCompletion = () => {
    // Default 25%
    let newPercentage = 25;

    if (currentUser) {
      if (currentUser.email.trim() !== "") {
        newPercentage += 25;
      }

      if (currentUser.profileImg.trim() !== "" && currentUser.userName !== "") {
        newPercentage += 25;
      }

      if (currentUser.hasHouseId !== null) {
        newPercentage += 25;
      }
    }

    setCompletionPercentage(newPercentage);
  };

  // console.log(completionPercentage, currentUser);

  useEffect(() => {
    updateCompletion();
    if (currentUser?.hasHouseId === 0) {
      setCardColor("#0000FF");
    } else if (currentUser?.hasHouseId === 1) {
      setCardColor("#6e14a7");
    } else if (currentUser?.hasHouseId === 2) {
      setCardColor("#FBC00E");
    } else if (currentUser?.hasHouseId === 3) {
      setCardColor("#01692f");
    } else if (currentUser?.hasHouseId === 4) {
      setCardColor("#D01110");
    } else {
      setCardColor("");
    }
  }, [currentUser]);

  useEffect(() => {
    if (address) {
      setCurrentWallet(address);
    }
  }, [address]);

  // redirect to mint function
  const redirectToMint = (redirect: string) => {
    if (redirect === "hash") {
      router.push(`/hash_page/${redirect}`);
    } else if (redirect === "conzura") {
      router.push(`/conzura_page/${redirect}`);
    } else if (redirect === "house") {
      router.push(`/house_page/${redirect}`);
    }
  };

  let smartWallet = useAddress();
  let personalWallet = usePersonalWalletAddress();

  const musicData = [
    {
      name: "The Comeback Kid",
      artist: "Lindi Ortega",
      cover:
        "https://raw.githubusercontent.com/muhammederdem/mini-player/master/img/7.jpg",
      source:
        "https://raw.githubusercontent.com/muhammederdem/mini-player/master/mp3/7.mp3",
      url: "https://www.youtube.com/watch?v=me6aoX0wCV8",
      favorited: true,
    },
  ];

  // Fetching profile data
  const fetchData = async () => {
    try {
      const response = await axios.get(`${backendUrl}/user`, {
        headers: {
          zurawallet: `${smartWallet}`,
        },
      });
      setUser(response?.data);
    } catch (error) {
      console.error("Error fetching profile data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [smartWallet]);

  useEffect(() => {
    const postUserData = async () => {
      try {
        if (smartWallet !== undefined && personalWallet !== undefined) {
          const payload = {
            zurawallet: smartWallet,
            personalwallet: personalWallet,
          };

          const response = await axios.post(
            `http://3.111.16.20:8080/user/profile`,
            payload
          );
          console.log(response.data);
        }
        return;
      } catch (error) {
        console.error(error);
      }
    };

    postUserData();
  }, [smartWallet, personalWallet]);

  // function for clamming token
  const claimKarma = () => {
    let amount: number = 100;

    try {
      claimToken(
        { amount, to: address as string },
        {
          onSuccess: (data) => {
            updateBackend({
              gotProfileReward: true,
            });
            setIsClaimmed(true);
            toast({
              title: `You git 100 Karma`,
              status: "success",
              isClosable: true,
            });
          },
        }
      );
    } catch (err) {
      console.log(err);
      toast({
        title: `something went wrong`,
        status: "error",
        isClosable: true,
      });
    }
  };

  // if houseNft minted, store the id to backend

  useEffect(() => {
    if (
      houseNfts &&
      houseNfts?.length > 0 &&
      currentUser &&
      currentUser?.hasHouseId === null
    ) {
      updateBackend({
        hasHouseId: houseNfts[0]?.metadata.id,
        hasHouseMetadata: houseNfts[0]?.metadata,
      });
    }
  }, [houseNfts, currentUser]);

  // function for manipulating backend
  const updateBackend = (payload: any) => {
    setUserUpdate(true);
    axios
      .put("http://3.111.16.20:8080/user/profile/update", payload, {
        headers: {
          Authorization: "Bearer your_access_token",
          "Content-Type": "application/json",
          zurawallet: smartWallet,
        },
      })
      .then((res) => {
        toast({
          title: `Profile updated`,
          status: "success",
          isClosable: true,
        });
        setUserUpdate(false);
        fetchData();
      })
      .catch((err) => {
        console.log(err);
        toast({
          title: `something went wrong`,
          status: "error",
          isClosable: true,
        });
        setUserUpdate(false);
      });
  };

  if (!currentUser && !address) {
    return redirectToHome();
  }

  return (
    <Box className={styles.container}>
      <Box className={styles.sidebar}>
        <Box onClick={redirectToHome} className={styles.logo}>
          <Image src="https://imgur.com/scwbA1J.png" width={"40px"} />
        </Box>
        <Box className={styles.links}>
          <VStack spacing={6} className={styles.link}>
            <Tooltip hasArrow label="Home" aria-label="A tooltip">
              <Box _hover={{ bg: houseCardColor }} className={styles.linkTag}>
                {<FaHome size={"20px"} />}
              </Box>
            </Tooltip>
            <Tooltip hasArrow label="Dashboard" aria-label="A tooltip">
              <Box _hover={{ bg: houseCardColor }} className={styles.linkTag}>
                {<MdDashboard size={"20px"} />}
              </Box>
            </Tooltip>
            <Tooltip hasArrow label="Profile" aria-label="A tooltip">
              <Box _hover={{ bg: houseCardColor }} className={styles.linkTag}>
                {<CgProfile size={"20px"} />}
              </Box>
            </Tooltip>
            <Tooltip hasArrow label="About" aria-label="A tooltip">
              <Box _hover={{ bg: houseCardColor }} className={styles.linkTag}>
                {<FcAbout size={"20px"} />}
              </Box>
            </Tooltip>
            <Tooltip hasArrow label="Contact Us" aria-label="A tooltip">
              <Box _hover={{ bg: houseCardColor }} className={styles.linkTag}>
                {<MdContactSupport size={"20px"} />}
              </Box>
            </Tooltip>
          </VStack>
        </Box>
      </Box>
      <Box className={styles.main}>
        <Flex
          display={{ base: "flex", md: "none" }}
          className={styles.mobileNav}
        >
          <Box
            cursor={"pointer"}
            onClick={redirectToHome}
            w={"40px"}
            h={"40px"}
          >
            <Image src="https://imgur.com/scwbA1J.png" width={"100%"} />
          </Box>
          <Box>
            <ConnectWallet />
          </Box>
        </Flex>
        <Box className={styles.profileSection} bg={houseCardColor}>
          <Box position={"relative"}>
            <Box className={styles.coverImg}>
              <Image
                width={"100%"}
                height={"100%"}
                src={"https://imgur.com/ZcQErOc.png"}
                alt="cover"
              />
              {completionPercentage === 100 ? null : (
                <Flex
                  h={"70px"}
                  w={"100%"}
                  top={0}
                  pos={"absolute"}
                  align={"center"}
                  justify={"start"}
                  bg={"#333652"}
                  gap={3}
                  p={3}
                >
                  <CircularProgress
                    value={completionPercentage}
                    color="#04D010"
                  >
                    <CircularProgressLabel>{`${completionPercentage}%`}</CircularProgressLabel>
                  </CircularProgress>
                  <Text>
                    {`Seems your profile is not completed.${
                      currentUser?.gotProfileReward === false
                        ? "Complete & earn 100 Karma Points 😋"
                        : ""
                    }`}
                  </Text>
                </Flex>
              )}
            </Box>
            <Box overflow={"hidden"} className={styles.profileImg}>
              <Image src={"https://imgur.com/n22iSFg.png"} alt="profile_pic" />
            </Box>
          </Box>
          <Box textAlign={"center"}>
            <Box
              textAlign={"end"}
              display={personalWallet === undefined ? "none" : "block"}
            >
              <EditModal
                updateFunc={updateBackend}
                fetchUser={fetchData}
                currentUser={currentUser}
                isUpdating={userUpdate}
              />
            </Box>
            <Text
              mt={personalWallet === undefined ? "70px" : "30px"}
              fontSize={"20px"}
              fontWeight={600}
            >
              {currentUser?.userName?.toUpperCase() || "Anonymous"}
            </Text>
            <Flex
              display={address ? "flex" : "none"}
              gap={3}
              justify={"center"}
              align={"center"}
            >
              <Text>{shortenIfAddress(address, true)}</Text>
              <CopyIcon cursor={"pointer"} />
            </Flex>
            <Box>
              <StatusIndicator />
            </Box>
            <Text>{`Email : ${currentUser?.email || "N/A"}`}</Text>
            <Flex className={styles.transectionBtn}>
              <Box>
                <SendFundModal />
              </Box>
            </Flex>
          </Box>
          {personalWallet === undefined ? (
            <Box p={4} textAlign={"center"}>
              <Text className={styles.neonText} fontWeight={600}>
                Switch to Zura Wallet
              </Text>
            </Box>
          ) : (
            <Box>
              <Box className={styles.boxContainer}>
                <Box className={styles.box}>
                  <Flex direction="column">
                    <Text>Karma Points</Text>
                    <Text fontSize={{ base: "16px", md: "25px" }}>
                      {(Number(tokenBalance?.displayValue) || 0).toFixed(0)}
                    </Text>
                  </Flex>
                  <Image
                    src="https://imgur.com/vaMs9nq.png"
                    w={"20%"}
                    h={"20%"}
                    alt="logo"
                  />
                </Box>
                <Box className={styles.box}>
                  <Flex direction="column">
                    <Text>{"Trees Planted"}</Text>
                    <Text fontSize={{ base: "16px", md: "25px" }}>
                      {(Number(tokenBalance?.displayValue) / 10).toFixed(0) ||
                        0}
                    </Text>
                  </Flex>
                  <Image
                    src="https://imgur.com/FzIURqN.png"
                    w={"40%"}
                    h={"40%"}
                    alt="logo"
                  />
                </Box>
                <Box className={styles.box}>
                  <Flex direction="column">
                    <Text>{"Carbon Offset (tonnes)"}</Text>
                    <Text fontSize={{ base: "16px", md: "25px" }}>
                      {`${
                        (
                          (Number(tokenBalance?.displayValue) / 10) *
                          0.025
                        ).toFixed(1) || 0
                      }
`}
                    </Text>
                  </Flex>
                  <Image
                    src="https://imgur.com/jwepmIH.png"
                    w={"40%"}
                    h={"40%"}
                    alt="logo"
                  />
                </Box>
                <Flex
                  align={"center"}
                  justify={"center"}
                  p={0}
                  className={styles.box}
                >
                  {<KarmaLevel />}
                </Flex>
              </Box>
              {completionPercentage == 100 &&
              currentUser?.gotProfileReward === false ? (
                <ClaimKarmaModal
                  func={claimKarma}
                  isLoading={clamming}
                  isClaimmed={isClaimmed}
                />
              ) : null}
            </Box>
          )}
          <Box>
            <button
              onClick={() => {
                disconnect();
                router.push("/");
              }}
              className={styles.btn}
            >
              {address ? "Logout" : "Login"}
            </button>
          </Box>
        </Box>
        <Box className={styles.nftSection}>
          <Tabs borderRadius={"5px"} w={"100%"} gap={{ base: 2, md: 7 }}>
            <TabList
              display={"flex"}
              justifyContent={"space-between"}
              alignItems={"center"}
              gap={0}
              border={"none"}
            >
              <Flex className={styles.tabs} gap={8} w={"100%"}>
                <InputGroup width={"50%"}>
                  <InputLeftElement pointerEvents="none">
                    <Search2Icon color="gray.300" />
                  </InputLeftElement>
                  <Input
                    border="1px solid #44444C"
                    type="text"
                    placeholder="Search for collections"
                  />
                </InputGroup>
                <Flex gap={2}>
                  <Tab
                    color={houseCardColor}
                    w={"100%"}
                    fontSize={{ base: "14px", md: "16px" }}
                  >
                    House
                  </Tab>
                  <Tab
                    color={houseCardColor}
                    w={"100%"}
                    fontSize={{ base: "14px", md: "16px" }}
                  >
                    Hash
                  </Tab>
                  <Tab
                    color={houseCardColor}
                    w={"100%"}
                    fontSize={{ base: "14px", md: "16px" }}
                  >
                    Conzura
                  </Tab>
                </Flex>
              </Flex>
              <Box display={{ base: "none", md: "block" }}>
                <ConnectWallet />
              </Box>
            </TabList>
            <TabPanels>
              <TabPanel p={"20px 120px"}>
                {houseNfts?.length === 0 ? (
                  <Box className={styles.emptyNFT}>
                    {personalWallet === undefined ? (
                      "No NFT's in your wallet"
                    ) : (
                      <Button onClick={(e) => redirectToMint("house")}>
                        Mint House
                      </Button>
                    )}
                  </Box>
                ) : (
                  <Box>
                    {houseNfts && houseNfts.length > 0 ? (
                      <Box
                        className={styles.nftCard}
                        key={houseNfts[0].metadata.id}
                      >
                        <Text color={houseCardColor} fontSize={"30px"}>
                          WELCOME IBOGAN
                        </Text>
                        <Text
                          fontWeight={200}
                          letterSpacing={"2px"}
                          fontSize={"20px"}
                        >
                          A tranquil haven promoting calm, dependability, and
                          thoughtfulness. Ideal for those who value a peaceful
                          atmosphere, seek reliability, structure, and enjoy
                          deep introspection—a blue house for a serene and
                          contemplative life. Daturathustars are the
                          philosophers of the universe.
                        </Text>
                        <Box bg={houseCardColor} className={styles.housePlayer}>
                          <Box className={styles.houseImg}>
                            <Image
                              src={houseNfts[0].metadata?.image || ""}
                              height={"100%"}
                              width={"100%"}
                              alt="nft"
                            />
                          </Box>
                          <Box className={styles.player}>
                            <Box bg={"transparent"}>
                              <Box className={styles.playerCover}>
                                <Image
                                  w={"100%"}
                                  alt="cover"
                                  src={musicData[0]?.cover}
                                />
                              </Box>
                              <Box color={"#141414"}>
                                <Text>{musicData[0]?.name}</Text>
                                <Text
                                  fontSize={"12px"}
                                >{`By ${musicData[0]?.artist}`}</Text>
                              </Box>
                              <Box mt={"20px"}>
                                <audio
                                  controls
                                  src="https://raw.githubusercontent.com/muhammederdem/mini-player/master/mp3/2.mp3"
                                ></audio>
                              </Box>
                            </Box>
                          </Box>
                        </Box>
                      </Box>
                    ) : null}
                  </Box>
                )}
              </TabPanel>
              <TabPanel p={"20px 0px"}>
                {hashNfts?.length === 0 ? (
                  <Box className={styles.emptyNFT}>
                    {personalWallet === undefined ? (
                      "No NFT's in your wallet"
                    ) : (
                      <Button onClick={(e) => redirectToMint("hash")}>
                        Mint Hash
                      </Button>
                    )}
                  </Box>
                ) : (
                  <Box className={styles.nftGrid}>
                    {hashNfts && hashNfts.length > 0
                      ? hashNfts.map((e) => (
                          <Box className={styles.nftCard} key={e.metadata.id}>
                            <ThirdwebNftMedia
                              metadata={e.metadata}
                              height={"100%"}
                              width={"100%"}
                            />
                            <Text
                              mt={2}
                              color={"grey"}
                              fontSize={"12px"}
                            >{`TOKEN ID #${e.metadata.id}`}</Text>
                            <Text>{e.metadata.name}</Text>
                            <SendNftModal data={e?.metadata} />
                          </Box>
                        ))
                      : null}
                  </Box>
                )}
              </TabPanel>
              <TabPanel p={"20px 0px"}>
                {conzuraNfts?.length === 0 ? (
                  <Box className={styles.emptyNFT}>
                    {personalWallet === undefined ? (
                      "No NFT's in your wallet"
                    ) : (
                      <Button onClick={(e) => redirectToMint("conzura")}>
                        Mint Conzura
                      </Button>
                    )}
                  </Box>
                ) : (
                  <Box className={styles.nftGrid}>
                    {conzuraNfts && conzuraNfts.length > 0
                      ? conzuraNfts.map((e) => (
                          <Box className={styles.nftCard} key={e.metadata.id}>
                            <ThirdwebNftMedia
                              metadata={e.metadata}
                              height={"100%"}
                              width={"100%"}
                            />
                            <Text
                              mt={2}
                              color={"grey"}
                              fontSize={"12px"}
                            >{`TOKEN ID #${e.metadata.id}`}</Text>
                            <Text>{e.metadata.name}</Text>
                          </Box>
                        ))
                      : null}
                  </Box>
                )}
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      </Box>
    </Box>
  );
}
