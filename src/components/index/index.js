import React from 'react'
import { makeStyles } from '@material-ui/core'


const useStyles = makeStyles(theme => ({
    TitleContainer: {
        alignItems: "center",
        '& h2': {
            fontWeight: 900,
            [theme.breakpoints.down('sm')]: {
                color: theme.palette.text.primary,
                textShadow: "none"
            },
            '&:after': {
                content: "''",
                color: theme.palette.background.default,
                textShadow: `-1px -1px 0 ${theme.palette.text.primary},  
                        1px -1px 0 ${theme.palette.text.primary},
                        -1px 1px 0 ${theme.palette.text.primary},
                        1px 1px 0 ${theme.palette.text.primary}`
            }
        }
    },
    ContainerDiv: {
        marginBottom: theme.spacing(5)
    },
    IndexHeader: {
        marginBottom: theme.spacing(2)
    }
}))

function TitleContainer(props) {
    const classes = useStyles()

    return (
        <div className={classes.TitleContainer}>
            {props.children}
        </div>
    )
}

export { useStyles, TitleContainer }