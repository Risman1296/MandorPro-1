import { Text, View, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { setSessionDemo } from "../../lib/auth";

export default function SignIn() {
  const router = useRouter();
  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
      }}
    >
      <Text>Sign in demo</Text>
      <Pressable
        onPress={() => {
          setSessionDemo({ userId: "123" });
          router.replace("/(app)/dashboard");
        }}
        style={{ padding: 12, borderWidth: 1, borderRadius: 8 }}
      >
        <Text>Sign In</Text>
      </Pressable>
    </View>
  );
}
