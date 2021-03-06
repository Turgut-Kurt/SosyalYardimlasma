import React, {Component} from 'react';
import {
  SafeAreaView,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  ToastAndroid,
  ActivityIndicator,
} from 'react-native';
import {connect} from 'react-redux';
import {SignIn} from '../../store/Actions/Auth/SignIn';
import {WorkerAdd} from '../../store/Actions/Workers/WorkerAdd';
import AuthControl from '../../utils/AuthControl';
import {Formik, Field} from 'formik';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import RegisterValidationSchema from '../../schema/RegisterValidation';
import {calcHeight, calcWidth} from '../../settings/dimensions';
import {
  CustomLoginInput,
  CustomPasswordInput,
  SafeStatusView,
} from '../../components';
import NavigationService from '../../services/NavigationService';

class RegisterScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      errors: '',
      profilImageBase64: '',
    };
  }
  handleBackButton = () => {
    this.props.navigation.goBack();
  };
  _handleSubmit = async (values, {resetForm}) => {
    await this.setState({loading: true});
    const {userName, phoneNumber, password, email} = values;
    let firstName = 's';
    let lastName = 's';
    let department = '1';
    try {
      await this.props.WorkerAdd(
        email,
        phoneNumber,
        firstName,
        lastName,
        userName,
        password,
        department,
      );
      const {data, error, loading} = await this.props.WorkerAddReducer;
      if (data !== null && error === null) {
        await this.props.SignIn(userName, password);
        const {token, userId, role} = await this.props.SignInReducer;
        if (token !== null && userId !== null && role !== null) {
          await AuthControl.saveToken('token', token, false);
          await AuthControl.saveToken('userId', userId, false);
          await AuthControl.saveToken('role', role, false);
        }
        console.log('data');
        console.log(data);
        console.log('data');
        console.log('error');
        console.log(error);
        console.log('error');
        ToastAndroid.show(
          'Kullanıcı başarıyla kayıt edildi.',
          ToastAndroid.LONG,
          ToastAndroid.CENTER,
        );
        resetForm();
      }
      if (error) {
        Alert.alert('İşlem başarısız oldu.');
      }
      this.setState({loading: false});
    } catch (error) {
      this.setState({loading: false});
    }
  };
  errorRender = (error) => {
    this.setState({
      errors: error,
    });
  };
  render() {
    const {loading, errors} = this.state;
    return (
      <SafeStatusView
        statusBackColor={'#fff'}
        statusBarStyle={'dark-content'}
        safeStyle={{backgroundColor: '#FFFFFF'}}
        content={
          <KeyboardAwareScrollView style={[styles.container]}>
            <View style={styles.TopViewStyle}>
              <Image
                source={require('../../assets/deneme.jpg')}
                style={styles.imageStyle}
              />
            </View>
            <Text style={styles.welcomeText}>Hoşgeldiniz</Text>
            <Formik
              validateOnMount={true}
              validationSchema={RegisterValidationSchema}
              initialValues={{
                userName: '',
                phoneNumber: '',
                email: '',
                password: '',
              }}
              onSubmit={this._handleSubmit}>
              {({handleSubmit, isValid}) => (
                <>
                  <View style={styles.inputViewStyle}>
                    <Field
                      component={CustomLoginInput}
                      name="userName"
                      placeholder="Kullanıcı Adı"
                      placeholderTextColor="#8E9092"
                    />
                  </View>
                  <View style={styles.inputViewStyle}>
                    <Field
                      component={CustomLoginInput}
                      name="phoneNumber"
                      placeholder="Telefon (Zorunlu)"
                      placeholderTextColor="#8E9092"
                      keyboardType="numeric"
                      maxLength={11}
                    />
                  </View>
                  <View style={styles.inputViewStyle}>
                    <Field
                      component={CustomLoginInput}
                      name="email"
                      placeholder="Email"
                      placeholderTextColor="#8E9092"
                    />
                  </View>
                  <View style={styles.inputViewStyle}>
                    <Field
                      component={CustomPasswordInput}
                      name="password"
                      placeholder="Şifre"
                      placeholderTextColor="#8E9092"
                      maxLength={12}
                    />
                  </View>
                  <View
                    style={[
                      styles.inputViewStyle,
                      {justifyContent: 'space-between'},
                    ]}>
                    {loading ? (
                      <ActivityIndicator size="large" color="black" />
                    ) : (
                      <>
                        <TouchableOpacity
                          style={
                            !isValid
                              ? styles.DisableButton
                              : styles.ActiveButton
                          }
                          disabled={!isValid}
                          onPress={handleSubmit}>
                          <Text style={styles.ButtonText}>KAYIT OL</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.goSignup}
                          onPress={this.handleBackButton}>
                          <Text>
                            Zaten bir hesabın var mı ? O halde Giriş Yap
                          </Text>
                        </TouchableOpacity>
                      </>
                    )}
                  </View>
                </>
              )}
            </Formik>
            <View style={styles.freeStyle2}>
              <View style={styles.errorWrapper}>
                {errors && errors['errorDescription'] ? (
                  <Text style={styles.errorText}>
                    {errors['errorDescription']}
                  </Text>
                ) : null}
              </View>
              <View style={styles.lineStyle} />
            </View>
          </KeyboardAwareScrollView>
        }
      />
    );
  }
}
const styles = StyleSheet.create({
  goSignup: {
    width: calcWidth(100) - 60,
    alignItems: 'center',
    paddingVertical: 4,
  },
  container: {flex: 1, backgroundColor: '#FFFFFF'},
  TopViewStyle: {
    marginTop: calcHeight(4),
    width: calcWidth(100),
    height: calcHeight(31),
  },
  imageStyle: {
    width: '100%',
    height: '100%',
  },

  welcomeText: {
    width: calcWidth(100),
    height: calcHeight(10),
    fontSize: 38,
    fontWeight: 'bold',
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  inputViewStyle: {
    width: calcWidth(100),
    height: calcHeight(10),
    alignItems: 'center',
  },
  ActiveButton: {
    backgroundColor: '#456BFF',
    borderRadius: 5,
    width: calcWidth(100) - 60,
    height: calcHeight(100) / 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  DisableButton: {
    backgroundColor: '#707070',
    borderRadius: 5,
    width: calcWidth(100) - 60,
    height: calcHeight(100) / 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ButtonText: {
    fontSize: calcHeight(1.14) + calcWidth(1.14),
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  freeStyle2: {
    width: calcWidth(100),
    height: calcHeight(25),
    alignItems: 'center',
    justifyContent: 'center',
  },
  lineStyle: {
    width: calcWidth(100) - 60,
    borderWidth: 1,
    borderColor: 'rgba(26, 26, 26, 0.2)',
  },
  errorWrapper: {
    top: 0,
    position: 'absolute',
    width: calcWidth(100) - 60,
    height: calcHeight(100) / 16,
  },
  errorText: {
    fontSize: 12,
    color: '#F61D45',
    textAlign: 'center',
    paddingVertical: 4,
  },
});
const mapStateToProps = (state) => {
  return {
    SignInReducer: state.SignInReducer,
    WorkerAddReducer: state.WorkerAddReducer,
  };
};

const mapDispatchToProps = {
  SignIn,
  WorkerAdd,
};

RegisterScreen = connect(mapStateToProps, mapDispatchToProps)(RegisterScreen);
export default RegisterScreen;
