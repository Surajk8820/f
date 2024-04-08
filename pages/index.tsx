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

  const redirectToConzura = () => {
    router.push("/conzura");
  };

  return (
    <Box className={styles.container}>
      <Box h={"80vh"} className={styles.headingSection} border={"1px  red"}>
        <Image
          width={"100%"}
          height={"100%"}
          src="https://imgur.com/y05NSF6.png"
          alt="seaction_logo"
        />
      </Box>
      <Box>
        <Box className={styles.headLine}>
          <Box className={styles.headingTxt}>
            <Text fontSize={"30px"}>Discover the vast universe of</Text>
            <Text
              className={styles.gradientTxt}
              letterSpacing={"4px"}
              fontSize={"75px"}
            >
              HIPPIE ALIENS
            </Text>
          </Box>
          <p className={styles.para}>
            H.A.C.K is the gateway to Zuraverse. H.A.C.K NFTs introduce
            Zuraverse to the Web3 audience.
            <br />
            <span>
              {" "}
              They are the stepping stone in the formation of Zuraverse.
            </span>
          </p>
          <Flex mt={7} gap={7}>
            <Button bg={"blue"}>Connect Wallet</Button>
            <Button>Read More</Button>
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
