import { useSignUp } from '@clerk/expo'
import { Link, useRouter } from 'expo-router'
import React, { useState } from 'react'
import { ActivityIndicator, Image, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native'

export default function SignUp() {

    const router = useRouter()
    const { signUp, errors, fetchStatus } = useSignUp()
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [code, setCode] = useState("")
    const [pendingVerification, setPendingVerification] = useState(false)

    const isLoading = fetchStatus === "fetching"

    const onSignUpPress = async () => {
        const { error } = await signUp.password({
            emailAddress: email,
            password,
            firstName,
            lastName
        })

        if (error) {
            alert(error.message)
            return
        }

        await signUp.verifications.sendEmailCode()
        setPendingVerification(true)
    }

    const onVerifyPress = async () => {
        const { error } = await signUp.verifications.verifyEmailCode({ code }) // ✅ capture error
        if (error) {                                                             // ✅ handle it
            alert(error.message)
            return
        }

        if (signUp.status === "complete") {
            await signUp.finalize({
                navigate: ({ session, decorateUrl }) => {
                    if (session?.currentTask) {
                        console.log(session?.currentTask)
                        return
                    }
                    const url = decorateUrl("/(root)/(tabs)")
                    router.replace(url as any)
                }
            })
        } else {
            console.error("Sign-up attempt not complete:", signUp.status)
            alert("Verification failed. Please try again.")
        }
    }

    if (pendingVerification) {
        return (
            <View className="flex-1 justify-center py-12 px-6">
                <Image source={require('../../assets/images/kribb.png')} className="w-32 h-16 mb-8" resizeMode="contain" />

                <Text className="text-3xl font-bold text-gray-800 mb-2">Verify your account</Text>

                <Text className="text-gray-500 mb-8">We sent a code to {email}</Text>

                <TextInput
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 mb-4"
                    placeholder="Enter Verification Code"
                    placeholderTextColor="#9CA3af"
                    value={code}
                    onChangeText={setCode}
                    keyboardType="number-pad"
                />
                {errors.fields.code && (
                    <Text className="text-red-500 mb-4">{errors.fields.code.message}</Text>
                )}

                <TouchableOpacity
                    onPress={onVerifyPress}
                    disabled={isLoading}
                    className="bg-blue-600 py-4 rounded-xl items-center mb-4"
                >
                    {isLoading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text className="text-white font-bold text-base">Verify</Text>
                    )}
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => signUp.verifications.sendEmailCode()}
                    disabled={isLoading}
                    className="py-2 mb-4"
                >
                    <Text className="text-blue-600">Resend Code</Text>
                </TouchableOpacity>
            </View>
        )
    }

    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="bg-white" keyboardShouldPersistTaps="handled">
            <View className="flex-1 justify-center py-12 px-6">
                <Image source={require('../../assets/images/kribb.png')} className="w-32 h-16 mb-8" resizeMode="contain" />

                <Text className="text-3xl font-bold text-gray-800 mb-2">Create an Account</Text>

                <Text className="text-gray-500 mb-8">Find your dream home today</Text>

                <View className="flex-row gap-3 mb-4">
                    <TextInput
                        className="flex-1 border border-gray-300 rounded-xl px-4 py-3"
                        placeholder="First Name"
                        placeholderTextColor="#9CA3af"
                        autoCapitalize="words"
                        value={firstName}
                        onChangeText={setFirstName}
                    />
                    <TextInput
                        className="flex-1 border border-gray-300 rounded-xl px-4 py-3"
                        placeholder="Last Name"
                        placeholderTextColor="#9CA3af"
                        autoCapitalize="words"
                        value={lastName}
                        onChangeText={setLastName}
                    />
                </View>

                <TextInput
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 mb-4"
                    placeholder="Email Address"
                    placeholderTextColor="#9CA3af"
                    autoCapitalize="none"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                />
                {errors.fields.emailAddress && (
                    <Text className="text-red-500 mb-4">{errors.fields.emailAddress.message}</Text>
                )}

                <TextInput
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 mb-6"
                    placeholder="Password"
                    placeholderTextColor="#9CA3af"
                    autoCapitalize="none"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />
                {errors.fields.password && (
                    <Text className="text-red-500 mb-4">{errors.fields.password.message}</Text>
                )}

                <TouchableOpacity
                    onPress={onSignUpPress}
                    disabled={isLoading}
                    className="bg-blue-600 py-4 rounded-xl items-center mb-4"
                >
                    {isLoading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text className="text-white font-bold text-base">Sign Up</Text>
                    )}
                </TouchableOpacity>

                <View className="flex-row justify-center gap-1">
                    <Text className="text-gray-500">Already have an account?</Text>
                    <Link href="/sign-in">
                        <Text className="text-blue-600 font-semibold">Sign In</Text>
                    </Link>
                </View>

                <View nativeID="clerk-captcha" />
            </View>
        </ScrollView>
    )
}