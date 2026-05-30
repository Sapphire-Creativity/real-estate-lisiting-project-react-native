import { useAuth } from '@clerk/expo'
import { useRouter } from 'expo-router'
import React from 'react'
import { SafeAreaView, Text, TouchableOpacity } from 'react-native'

export default function Profile() {
    const { signOut } = useAuth()
    const router = useRouter()
    const handleSignOut = async () => {
        await signOut()
        router.replace("/sign-in")
    }
    return (
        <SafeAreaView>
            <Text>Profile</Text>
            <TouchableOpacity onPress={handleSignOut}>
                <Text>Sign Out</Text>
            </TouchableOpacity>
        </SafeAreaView>
    )
}