import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import { Link, Redirect } from "react-router-dom";
import { indexPage, registerPage } from "../../config/front-routes";
import postDataToAPI from "../../helpers/postDataToAPI";
import { useSnackbar } from "notistack";

import { VscLock } from "react-icons/vsc";
import { MdArrowBack } from "react-icons/md";

import useStyles from "./logIn.styles";
import { useContext, useState } from "react";
import { loginRoute } from "../../config/api-routes";
import UserContext from "../../contexts/user.context";
import { Typography } from "@material-ui/core";
import Loading from "../../components/progress";
import { useTranslation } from "react-i18next";
import { Alert } from "@material-ui/lab";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

export default function LoginPage() {
    const { t } = useTranslation("pages");
    const { executeRecaptcha } = useGoogleReCaptcha();
    const classes = useStyles();
    const { enqueueSnackbar } = useSnackbar();
    const [user, setUser] = useContext(UserContext);

    const [userData, setUserData] = useState({ username: "", password: "" });
    const [loginLoading, setLoginLoading] = useState(false);
    const [loginError, setLoginError] = useState({});

    function _handleInputChange(event) {
        setUserData((state) => ({
            ...state,
            [event.target.id]: event.target.value,
        }));
    }

    async function _handleSubmit(event) {
        event.preventDefault();
        setLoginLoading(true);
        setLoginError({});
        const token = await executeRecaptcha("login_page");
        postDataToAPI({
            route: loginRoute,
            data: { ...userData, recaptcha_response: token },
        })
            .then((res) => {
                if (res.status === 200) {
                    setUser({
                        username: res.data.username,
                        token: res.data.token,
                        exp: res.data.exp,
                        admin: res.data.admin,
                    });
                    enqueueSnackbar("Başarıyla giriş yapıldı", {
                        variant: "success",
                        autoHideDuration: 3500,
                    });
                    setLoginLoading(false);
                }
            })
            .catch((err) => {
                if (typeof err.response.data === "string") {
                    enqueueSnackbar(err.response.data, {
                        variant: "error",
                        autoHideDuration: 3500,
                    });
                } else {
                    console.log(err.response);
                    enqueueSnackbar("Bir sorunla karşılaştık!", {
                        variant: "error",
                        autoHideDuration: 3500,
                    });
                    setLoginError(err.response.data);
                }
                setLoginLoading(false);
            });
    }

    return (
        <Grid container component='main' className={classes.MainContainer}>
            {user.token ? <Redirect to={indexPage} /> : ""}
            <Grid item xs={false} sm={4} md={7} className={classes.Image} />
            <Grid item xs={12} sm={8} md={5} className={classes.RightContainer}>
                <div className={classes.RightContainerInner}>
                    <div className={classes.BackButtonContainer}>
                        <Link to={indexPage}>
                            <MdArrowBack size={24} />
                        </Link>
                    </div>
                    <Avatar className={classes.Avatar}>
                        <VscLock />
                    </Avatar>
                    <Typography variant='h3' component='h1'>
                        {process.env.REACT_APP_SITE_NAME}{" "}
                        {t("user.login.title")}
                    </Typography>
                    <form
                        className={classes.FormContainer}
                        noValidate
                        onSubmit={_handleSubmit}
                    >
                        <TextField
                            variant='outlined'
                            margin='normal'
                            required
                            fullWidth
                            id='username'
                            label={t("user.common.inputs.username")}
                            error={loginError.username ? true : false}
                            helperText={
                                loginError.username ? loginError.username : ""
                            }
                            name='username'
                            autoComplete='username'
                            autoFocus
                            onChange={_handleInputChange}
                            value={userData.username}
                        />
                        <TextField
                            variant='outlined'
                            margin='normal'
                            required
                            fullWidth
                            name='password'
                            label={t("user.common.inputs.password")}
                            error={loginError.password ? true : false}
                            helperText={
                                loginError.password ? loginError.password : ""
                            }
                            type='password'
                            id='password'
                            autoComplete='password'
                            onChange={_handleInputChange}
                            value={userData.password}
                        />
                        <Button
                            type='submit'
                            fullWidth
                            variant='contained'
                            color='primary'
                            className={classes.SubmitButton}
                            disabled={loginLoading ? true : undefined}
                        >
                            {loginLoading ? (
                                <Loading size={17} />
                            ) : (
                                t("user.login.title")
                            )}
                        </Button>
                        <Grid container>
                            {/* <Grid item xs>
                                <Link href="#" variant="body2">
                                    Forgot password?
                                </Link>
                            </Grid> */}
                            <Grid item>
                                <Link to={registerPage} variant='body2'>
                                    {t("user.login.buttons.dont_have_account")}
                                </Link>
                            </Grid>
                        </Grid>
                    </form>
                    {loginError && loginError.message ? (
                        <div className={classes.ErrorContainer}>
                            <Typography variant='body1'>
                                {loginError.message}
                            </Typography>
                        </div>
                    ) : (
                        ""
                    )}
                    <Alert severity='info' className={classes.GoogleTerms}>
                        This site is protected by reCAPTCHA and the Google{" "}
                        <a href='https://policies.google.com/privacy'>
                            Privacy Policy
                        </a>{" "}
                        and{" "}
                        <a href='https://policies.google.com/terms'>
                            Terms of Service
                        </a>{" "}
                        apply.
                    </Alert>
                </div>
            </Grid>
        </Grid>
    );
}
