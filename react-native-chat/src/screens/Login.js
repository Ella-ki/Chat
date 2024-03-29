import React, { useState, useRef, useEffect, useContext } from 'react';
import { ProgressContext, UserContext } from '../contexts';
import styled from 'styled-components/native';
//TouchableWithoutFeedback 터치관련 피드백
import {TouchableWithoutFeedback, Keyboard } from "react-native";
import { Image, Input, Button } from '../components';
import { images } from '../utils/images';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { validateEmail, removeWhitespace } from '../utils/common';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Alert } from 'react-native';
import { login } from '../utils/firebase'; 

const Container = styled.View`
    flex: 1;
    justify-content: center;
    align-items: center;
    background-color: ${({ theme }) => theme.background};
    padding: 0 20px;
    padding-top: ${({ insets: { top } }) => top}px;
    padding-bottom: ${({ insets: { bottom } }) => bottom}px;
`;

const ErrorText = styled.Text`
    align-items: flex-start;
    width: 100%;
    height: 20px;
    margin-bottom: 10px;
    line-height: 20px;
    color: ${({ theme }) => theme.errorText};
`;

const Login = ({ navigation }) => {
    const { spinner } = useContext(ProgressContext);
    const {dispatch} = useContext(UserContext);
    const insets = useSafeAreaInsets();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const passwordRef = useRef();
    const [errorMessage, setErrorMessage] = useState('');
    const [disabled, setDisabled] = useState(true);

    useEffect(() => {
        setDisabled(!(email && password && !errorMessage));
    }, [email, password, errorMessage]);

    const _handleEmailChange = email => {
        const changedEmail = removeWhitespace(email);
        setEmail(changedEmail);
        setErrorMessage(
            validateEmail(changedEmail) ? '' : 'Please verify your email.'
        );
    };

    const _handlePasswordChange = password => {
        setPassword(removeWhitespace(password));
    };

    // 로그인 기능 -> 데이터를 데이터베이스 회원이랑 비교
    const _handleLoginButtonPress = async () => {
        try {
            spinner.start();
            const user = await login({ email, password });
            Alert.alert('Login Success', user.email);
            dispatch(user);
        } catch(e) {
            Alert.alert('Login Error', e.message);
        } finally {
            spinner.stop();
        }
    };

    return (
        <KeyboardAwareScrollView 
            contentContainerStyle={{ flex:1 }}
            extraScrollHeight={20}
        >
            <Container insets={insets}>
                <Image url={images.logo} imageStyle={{ borderRadius: 8 }} />
                <Input
                    label="Email"
                    value={email}
                    //onChangeText={text => setEmail(text)}
                    //onSubmitEditing={() => passwordRef.current.focus()}
                    onChangeText={_handleEmailChange}
                    onSubmitEditing={() => passwordRef.current.focus()}
                    placeholder="Email"
                    returnkeyType="next"
                />
                <Input
                    ref={passwordRef}
                    label="Password"
                    value={password}
                    //onChangeText={text => setPassword(text)}
                    onChangeText={_handlePasswordChange}
                    onSubmitEditing={_handleLoginButtonPress}
                    placeholder="Password"
                    returnkeyType="done"
                    isPassword
                />
                <ErrorText>{errorMessage}</ErrorText>
                <Button 
                    title="Login" 
                    onPress={_handleLoginButtonPress} 
                    disabled={disabled} 
                />
                <Button 
                    title="Sign up with email"
                    onPress={() => navigation.navigate('Signup')}
                    isFilled={false}
                />
            </Container>
        </KeyboardAwareScrollView>
    );
};

export default Login;