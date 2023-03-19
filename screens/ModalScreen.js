import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import React from 'react';
import tw from "tailwind-rn";
import useAuth from '../hooks/useAuth';

const ModalScreen = () => {
    const { user } = useAuth;
    const navigation = useNavigation();
    const [image, setImage] = useState(null);
    const [job, setJob] = useState(null);
    const [age, setAge] = useState(null); 

    const incompleteForm = !image || !job || !age;
    const updateUserProfile = () => { 
        setDoc(doc(db, "users", user.uid), {
            id: user.uid,
            displayName: user.displayName,
            photoURL: image,
            job: job,
            age: age,
            timestamp: serverTimestamp(),
        })
         .then(() => {
            navigation.navigate("Home");
         })
         .catch((error) => {
            alert(error.message);
         });
    };
  return (
    <View style={tw("flex-1 items-center pt-1")}>
        <Image
        style={tw("h-20 w-full")}
        resizeMode="contain"
        source={{ uri: "https://pixabay.com/photos/night-camera-photographer-photo-1927265" }}
        />
        <Text style={tw("text-xl text-gray-500 p-2 font-bold")}>Welcome {user.displayName}</Text>

        <Text style={tw("text-center text-red-400 p-4 font-bold")}>
          Step1: The Profile Pic
        </Text>
        <TextInput
            value={image}
            onChangeText={setImage}
            style={tw("text-center text-xl pb-2")}
            placeholder='Enter a Profile Pic URL'
        />

        <Text style={tw("text-center text-red-400 p-4 font-bold")}>
          Step2: The Job
        </Text>
        <TextInput
            value={job}
            onChangeText={text => setJob(text)} 
            style={tw("text-center text-xl pb-2")}
            placeholder='Enter your occupation' 
        />

        <Text style={tw("text-center text-red-400 p-4 font-bold")}>
          Step3: The Age
        </Text>
        <TextInput
            value={age}
            onChangeText={text => setAge(text)} 
            style={tw("text-center text-xl pb-2")}
            placeholder='Enter your age'
            keyboardType='numeric'
            maxLength={29}
        />

        <TouchableOpacity
            disabled={incompleteForm}
            style={[
                tw("w-64 p-3 rounded-xl absolute bottom-10"),
                incompleteForm ? tw("bg-gray-400") : tw("bg-red-400"),
            ]}
            onPress={updateUserProfile}
        >
            <Text style={tw("text-center text-white text-xl")}>Update Profile</Text>
        </TouchableOpacity>
    </View>
  )
}

export default ModalScreen