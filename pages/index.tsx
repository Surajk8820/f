import { ConnectWallet } from "@thirdweb-dev/react";
import styles from "../styles/Home.module.css";
import { NextPage } from "next";
import {
  Box,
  Button,
  Flex,
  Heading,
  Text,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Image,
} from "@chakra-ui/react";
import TabCard from "../components/TabCard";
import { useRouter } from "next/router";

const Home: NextPage = () => {
  const router = useRouter();

  const redirectToHash = () => {
    router.push("/hash_page/hash");
  };

  return (
    <Box className={styles.container}>
      <Box
        p={"0px 15px"}
        h={"45vh"}
        className={styles.headingSection}
        border={"1px  red"}
      >
        <Image
          width={"100%"}
          height={"100%"}
          src="https://imgur.com/YeRU73n.png"
          alt="seaction_logo"
        />
      </Box>
      <Box>
        <Box className={styles.headLine}>
          <Box className={styles.headingTxt}>
            <Text fontSize={"20px"}>
              Cruise through the vast expance of space through
            </Text>
            <Text letterSpacing={"4px"} fontSize={"50px"}>
              HIPPIE ALIEN SPACE HOVERSHIP
            </Text>
          </Box>
          <p className={styles.para}>
            Welcome to the whimsical and psychedelic world of the Hippie Alien
            Space Hovership (HASH) NFT Collection! Prepare to embark on a cosmic
            journey like no other as you discover five extraordinary spaceships
            used by the free-spirited Hippie Aliens to traverse the vast reaches
            of the universe.
          </p>
          <Flex mt={7} gap={7}>
            <Button
              onClick={redirectToHash}
              bg={"blue"}
              color={"white"}
              _hover={{ color: "black", bg: "white" }}
            >
              Mint Now
            </Button>
            <Button>
              <a
                href="https://zuraverse.xyz/"
                target="_blank"
                style={{ textDecoration: "none" }}
              >
                Read More
              </a>
            </Button>
          </Flex>
        </Box>
      </Box>

      <Box className={styles.tabs}>
        <Tabs>
          <TabList>
            <Tab>Zuraverse</Tab>
            {/* <Tab>Conzura</Tab> */}
          </TabList>

          <TabPanels>
            <TabPanel className={styles.grid}>
              <TabCard />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Box>
  );
};

export default Home;
