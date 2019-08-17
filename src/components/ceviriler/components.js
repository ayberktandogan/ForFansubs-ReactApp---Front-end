import styled from 'styled-components'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import DisqusBox from '../../config/disqus'

import yellow from '@material-ui/core/colors/yellow'

import { Parallax } from 'react-parallax'

import { anchorI, bookI, calendarI, computerI, paintbrushI, videoI } from '../../config/theming/images'

function getIcon(icon) {
    switch (icon) {
        case "translator":
            return bookI;
        case "encoder":
            return computerI;
        case "editor":
            return paintbrushI;
        case "genres":
            return anchorI;
        case "time":
            return calendarI;
        case "studio":
            return videoI;
        default:
            return false
    }
}

const ContentHeader = styled(Grid)``

const ContentHeaderImage = styled(Parallax)`
    width: 100%;
    max-width: 100%;
    height: 300px;
    
    img {
        background-size: cover;
        top: -20%;
    }
`

const ContentLeft = styled(Grid)`
    max-width: 225px;
    min-width: 225px;
`

const ContentImage = styled(Box)`
    max-width: calc(225px - ${props => props.spacingvalue}px);
    width: calc(225px - ${props => props.spacingvalue}px);

    img {
        width: inherit;
    }
`

const ContentMetadata = styled(Box)`
    span {
        font-size: .9rem;
        display: block;
    }
    background-image: ${props => getIcon(props.type)}
`

const MetadataHeader = styled(Typography)`
    font-size: 1.1rem!important;
`

const ContentGenres = styled.ul`
    margin-bottom: -3px;

    li {
        display: inline-block;
        padding: 2px 4px;
        background: ${props => props.bgcolor};
        margin: 0 3px 3px 0;

        span {
            font-size: .6rem;
            font-weight: 400!important;
        }
    }
`

const ContentRight = styled(Grid)``

const ContentTitle = styled(Typography)`
    font-size: 3rem!important;
`

const ContentTitleBadge = styled(Box)`
    padding: 5px;
    margin: 0 5px!important;
    span {
        font-size: .7rem!important;
    }
`

const ContentRightAltTitle = styled(Typography)`
    display: flex;
    align-items: center;

    :after {
        content: "";
        height: 2px;
        flex: 1 1 auto;
        margin-left: 14px;
        opacity: .6;
        background: ${props => props.aftercolor}
    }
`

const ContentSynopsis = styled(Typography)``

const ContentEpisodesContainer = styled(Grid)``

const ContentEpisodes = styled.ul`
    button {
        margin: ${props => `0 ${props.spacing}px ${props.spacing}px 0`}
        display: inline-block;
    }
`

const ContentEpisodesLinksButton = styled(Box)`
:hover {
    transition: ${props => props.transition};
    :hover {
        background: ${props => props.hoverbg};
    }
}
`

const ContentEpisodesError = styled(Box)`
    border-left: ${yellow.A200} 4px solid;
    display: flex;
    align-items: center;
    svg {
        margin-right: 5px
    }
`

const ContentLinks = styled(Grid)`
    button {
        margin-right: 5px;
        margin-bottom: 5px;
    }
`

const ContentLinksButton = styled(Button)``

const ContentCommentsContainer = styled(DisqusBox)``

const Content = styled.div`
    @media(max-width:${props => props.theme.breakpoints.values.sm}px) {
        ${ContentTitle} {
            font-size: 1.6rem!important;
            display: block;
        }

        ${ContentTitleBadge} {
            margin: 0!important;
            span {
                font-size: .6rem!important;
            }
        }

        ${ContentGenres} {
            margin: 0;
            padding: 0;
        }

        ${ContentImage} {
            max-width: calc(185px - ${props => props.spacingvalue}px);
            width: calc(185px - ${props => props.spacingvalue}px);
        }
    }
`

function episodeParser(episodenumber, specialtype) {
    if (specialtype === "toplu")
        return `TOPLU LİNK`

    if (specialtype && specialtype !== "toplu") {
        return `${specialtype.toUpperCase()} ${episodenumber}`
    }
    else return `${episodenumber}. Bölüm`
}

const defaultBoxProps = {
    boxShadow: 2, p: 1, mb: 1, bgcolor: "background.level2"
}

export {
    Content,
    ContentHeader,
    ContentHeaderImage,
    ContentLeft,
    ContentImage,
    ContentMetadata,
    MetadataHeader,
    ContentGenres,
    ContentRight,
    ContentTitle,
    ContentTitleBadge,
    ContentRightAltTitle,
    ContentSynopsis,
    ContentEpisodesContainer,
    ContentEpisodes,
    ContentEpisodesLinksButton,
    ContentEpisodesError,
    ContentLinks,
    ContentLinksButton,
    ContentCommentsContainer,
    episodeParser,
    defaultBoxProps
}