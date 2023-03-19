import { View, Text, Button, SafeAreaView, Image, TouchableOpacity, StyleSheet } from 'react-native'
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import useAuth from '../hooks/useAuth'
import tw from "tailwind-rn";
import { AntDesign, Entypo, Ionicons } from "@expo/vector-icons";
import Swiper from "react-native-deck-swiper";
import { collection, doc, onSnapshot, query, setDoc, where, getDocs } from "@firebase/firestore";
import { db } from "../firebase";
import generateId from '../lib/generateId';

const DUMMY_DATA = [
  {
    firstName: "Sonny",
    lastName: "Sangha",
    job: "Software Developer",
    photoURL: "https://pixabay.com/photos/entrepreneur-start-up-man-planning-593358/",
    age: 27,
    id: 123,
  },
  {
    firstName: "Sonia",
    lastName: "Kaur",
    job: "React Developer",
    photoURL: "https://pixabay.com/photos/night-camera-photographer-photo-1927265/",
    age: 25,
    id: 456,
  },
  {
    firstName: "Sonu",
    lastName: "Roy",
    job: "Web Developer",
    photoURL: "https://pixabay.com/photos/entrepreneur-start-up-man-planning-593371/",
    age: 32,
    id: 789,
  },
];
const HomeScreen = () => {
    const navigation = useNavigation();
    const { logout, user } = useAuth();
    const [profiles, setProfiles] = useState([]);
    const swipeRef = useRef(null);


    useLayoutEffect(
      () => 
        onSnapshot(doc(db, "users", user.uid), (snapshot) => {
        if (!snapshot.exists) {
          navigation.navigate("Modal");
        }
      }),
      //return unsub();
      // navigation.setOptions({
      //   headerShown: false,
      // });
      []
    );

    useEffect(() => {
      let unsub;
      const fetchCards = async () => {
        const passes = await getDocs(collection(db, "users", user.uid, "passes")).then(
          (snapshot) => snapshot.docs.map((doc) => doc.id)
        );
        const swipes = await getDocs(collection(db, "users", user.uid, "swipes")).then(
          (snapshot) => snapshot.docs.map((doc) => doc.id)
        );
        const passedUserIds = passes.length > 0 ? passes : ["test"];
        const swipedUserIds = swipes.length > 0 ? swipes : ["test"];
        unsub = onSnapshot(
          query(
            collection(db, "users"),
            where("id", "not-in", [...passedUserIds, ...swipedUserIds])
          ),
          (snapshot) => {
            setProfiles(
            snapshot.docs
              .filter(doc => doc.id !== user.uid)
              .map((doc) => ({
               id: doc.id,
               ...doc.data(),
              }))
            );
         }
      );
   };
      fetchCards();
      return unsub;
    }, [db]);
    //console.log(profiles);

    const swipeLeft = (cardIndex) => {
      if (!profiles[cardIndex]) return;
      const userSwiped = profiles[cardIndex];
      console.log('You swiped PASS on ${userSwiped.displayName}');
      setDoc(doc(db, "users", user.uid, "passes", userSwiped.id), userSwiped);
    };

    const swipeRight = async (cardIndex) => {
      if (!profiles[cardIndex]) return;
      
      const userSwiped = profiles[cardIndex];
      const loggedInProfile = await (
        await getDoc(doc(db, "users", user.uid))
      ).data();
      //check if the user swiped on you
      getDoc(doc(db, "users", userSwiped.id, "swipes", user.uid)).then(
        (documentSnapshot) => {
          if (documentSnapshot.exists()) {
            //user has matched with you before you matched with them
            //create a match
            console.log('Hooray, You matched with  ${userSwiped.displayName}');
            setDoc(
              doc(db, "users", user.uid, "swipes", userSwiped.id),
              userSwiped
            );
            //create a match
            setDoc(doc(db, 'matches', generateId(user.uid, userSwiped.id)), {
              users: {
                [user.uid]: loggedInProfile,
                [userSwiped.id]: userSwiped,
              },
              usersMatched: [user.uid, userSwiped.id],
              timestamp: serverTimestamp(),
            });
            navigation.navigate("Match", {
              loggedInProfile,
              userSwiped,
            });
          } else {
            //User has swiped as first interaction between the two or didn't get swiped on
            console.log(
              'You swiped on  ${userSwiped.displayName}  (${userSwiped.job})'
            ); 
            setDoc(
              doc(db, "users", user.uid, "swipes", userSwiped.id),
              userSwiped
            );
          }
        }
      );
    };

  return (
    <SafeAreaView style={tw("flex-1")}>
      {/* Header */}
        <View style={tw("flex-row items-center justify-between px-5")}>
          <TouchableOpacity onPress={logout}>
            <Image
              style= {tw("h-10 w-10 rounded-full")}
              source={{ uri: user.photoURL }}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate("Modal")}>
            <Image style={tw("h-14 w-14")} source={require ("../logo.png")} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate("Chat")}>
            <Ionicons name='chatbubbles-sharp' size={30} color="#FF5864" />
          </TouchableOpacity>
        </View>
        
      {/* End of Header */}
      {/* Cards */}
      <View style={tw("flex-1 -mt-6")}>
        <Swiper
        ref={swipeRef}
        containerStyle={{ backgroundColor: "transparent" }}
        //cards={DUMMY_DATA}
        cards={profiles}
        stackSize={5}
        cardIndex={0}
        animateCardOpacity
        verticalSwipe={false}
        onSwipedLeft={(cardIndex) => {
          console.log("Swipe PASS");
          swipeLeft(cardIndex);
        }}
        onSwipedRight={(cardIndex) => {
          console.log("Swipe MATCH");
          swipeRight(cardIndex);
        }}
        overlayLabels={{
          left: {
            title: "NOPE",
            style: {
              label: {
                textAlign: "right",
                color: "red",
              },
            },
          },
          right: {
            title: "MATCH",
            style: {
              label: {
                color: "#4DED30",
              },
            },
          }
        }}
        renderCard={(card) => card ? (
          <View key={card.id} style={tw("relative bg-white h-3/4 rounded-xl")}>
            <Image 
            style={tw("absolute top-0 h-full w-full rounded-xl")}
            source={{ uri: card.photoURL }} 
            />
            <View
             style={[
              tw(
                  "absolute bottom-0 bg-white w-full flex-row justify-between items-center h-20 px-6 py-2 rounded-b-xl"
                ),
                styles.cardShadow,
             ]}
            >
              <View>
                <Text style={tw("text-xl font-bold")}>
                  {/* {card.firstName} {card.lastName} */}
                  {card.displayName}
                </Text>
                <Text>{card.job}</Text>
              </View>
              <Text style={tw("text-2xl font-bold")}>{card.age}</Text>
            </View>
            {/* <Text>{card.firstName}</Text> */}
          </View>
        ) : ( 
          <View
            style={[
              tw(
                "relative bg-white h-3/4 rounded-xl justify-center items-center"
              ),
              styles.cardShadow,
            ]}
            >
              <Text style={tw("font-bold pb-5")}>No more profiles</Text>
              <Image 
                style={tw("h-20 w-full")}
                height={100}
                width={100}
                source={{ uri: "https://links.papareact.com/6gb" }}
              />
          </View>
        )
      }
    />

      </View>
      <View styles={tw("flex flex-row justify-evenly")}>
        <TouchableOpacity 
        onPress={() => swipeRef.current.swipeLeft()}
        style={tw(
          "items-center justify-center rounded-full w-16 h-16 bg-red-200"
        )}>
          <Entypo name="cross" size={24} color="red" />
        </TouchableOpacity>
        
        <TouchableOpacity 
        onPress={() => swipeRef.current.swipeRight()}
        style={tw(
          "items-center justify-center rounded-full w-16 h-16 bg-green-200"
        )}>
          <AntDesign name="heart" size={24} color="green" />
        </TouchableOpacity>
      </View>

      {/* <Text>I am the HomeScreen</Text>
      <Button title= "Go to Chat Screen"
       onPress={() => navigation.navigate("Chat")} 
      />
      <Button title='Logout' onPress={logout} /> */}
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  cardShadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  }
})