import React from 'react'

import Grid from '@material-ui/core/Grid'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import WarningIcon from '@material-ui/icons/Warning';

import Moment from 'react-moment'
import { mangaDateFormat } from '../../../config/moment'

import {
    ContentLeft,
    ContentImage,
    ContentMetadata,
    ContentGenres,
    ContentRight,
    ContentTitle,
    ContentRightAltTitle,
    ContentSynopsis,
    ContentEpisodesContainer,
    ContentEpisodes,
    ContentEpisodesError,
    ContentLinks,
    ContentLinksButton,
    ContentCommentsContainer,
    defaultBoxProps,
    MetadataHeader,
    Content
} from '../../../components/ceviriler/components'

export default function MangaIndexMobile(props) {
    const { manga, theme } = props

    return (
        <Content theme={theme}>
            <Grid container>
                <ContentLeft item xs>
                    <Grid container direction="row" justify="flex-start" alignItems="flex-start">
                        <ContentTitle variant="h1" gutterBottom>
                            {manga.name}
                        </ContentTitle>
                    </Grid>
                    <ContentMetadata
                        m={4}
                        display="flex"
                        justifyContent="center"
                    >
                        <ContentImage
                            component="img" alt={manga.name + " coverart"}
                            boxShadow={2}
                            spacingvalue={theme.spacing(2)}
                            src={manga.cover_art}
                            mb={0} />
                    </ContentMetadata>
                    <MetadataHeader variant="body2">Çevirmen</MetadataHeader>
                    <ContentMetadata {...defaultBoxProps}>
                        {manga.translators.length !== 0 ?
                            manga.translators.map(data =>
                                <Typography variant="body2" key={data + "translator"}>{data}</Typography>)
                            :
                            <Typography variant="body2">Çevirmen bulunamadı.</Typography>
                        }
                    </ContentMetadata>
                    <MetadataHeader variant="body2">Editör</MetadataHeader>
                    <ContentMetadata {...defaultBoxProps}>
                        {manga.editors.length !== 0 ?
                            manga.editors.map(data =>
                                <Typography variant="body2" key={data + "editors"}>{data}</Typography>)
                            :
                            <Typography variant="body2">Editör bulunamadı.</Typography>
                        }
                    </ContentMetadata>
                    <MetadataHeader variant="body2">Yazar</MetadataHeader>
                    <ContentMetadata {...defaultBoxProps}>
                        {manga.authors.length !== 0 ?
                            manga.authors.map(data =>
                                <Typography variant="body2" key={data + "author"}>{data}</Typography>)
                            :
                            <Typography variant="body2">Yazar bulunamadı.</Typography>
                        }
                    </ContentMetadata>
                    <MetadataHeader variant="body2">Çıkış Zamanı</MetadataHeader>
                    <ContentMetadata {...defaultBoxProps}>
                        <Typography variant="body2">
                            {manga.release_date ?
                                <Moment format={mangaDateFormat} locale="tr">{manga.release_date}</Moment>
                                :
                                <Typography variant="body2">Çıkış tarihi bulunamadı.</Typography>
                            }
                        </Typography>
                    </ContentMetadata>
                    <MetadataHeader variant="body2">Türler</MetadataHeader>
                    <ContentMetadata {...defaultBoxProps} mb={2}>
                        <ContentGenres bgcolor={theme.palette.background.level1}>
                            {manga.genres.length !== 0 ?
                                manga.genres.map(data =>
                                    <li key={data + "genre"}>
                                        <Typography variant="body2">
                                            {data}
                                        </Typography>
                                    </li>)
                                :
                                <Typography variant="body2">Tür bulunamadı.</Typography>}
                        </ContentGenres>
                    </ContentMetadata>
                </ContentLeft>
                <ContentRight item xs={12} md>
                    <Box mb={2}>
                        <ContentRightAltTitle variant="h4" aftercolor={theme.palette.text.primary}>Özet</ContentRightAltTitle>
                        <ContentSynopsis variant="subtitle1">
                            {manga.synopsis ? manga.synopsis : "Konu bulunamadı."}
                        </ContentSynopsis>
                    </Box>
                    <Box mb={2}>
                        <Grid container spacing={2}>
                            <ContentEpisodesContainer item xs={12} md={8}>
                                <ContentRightAltTitle variant="h4" aftercolor={theme.palette.text.primary}>Bölümler</ContentRightAltTitle>
                                <ContentEpisodes spacing={theme.spacing(1)}>
                                    <ContentEpisodesError {...defaultBoxProps}>
                                        <WarningIcon /><Typography variant="subtitle2">
                                            {manga.download_link ?
                                                manga.mos_link ?
                                                    "İndirmeyi yandaki/aşağıdaki butondan yapabilirsiniz. Okumak için mangayı oku butonuna bastığınızda MOŞ'a yönlendirileceksiniz."
                                                    :
                                                    "İndirmeyi yandaki/aşağıdaki butondan yapabilirsiniz. Okuma linki bulamadık."
                                                :
                                                "Görünüşe göre bu seri için indirme linki eklememişiz. Bize Facebook sayfamızdan ya da Discord sunucumuzdan ulaşabilirsiniz."} {manga.mos_link ? "" : "Okuma özelliği bu sitede bulunmamaktadır."}
                                        </Typography></ContentEpisodesError>
                                </ContentEpisodes>
                            </ContentEpisodesContainer>
                            <ContentLinks item xs>
                                <a href={manga.mal_link} target="_blank" rel="noopener noreferrer">
                                    <ContentLinksButton variant="contained" fullWidth>
                                        <Typography variant="h6">MyAnimeList Konusu</Typography>
                                    </ContentLinksButton>
                                </a>
                                {manga.download_link ?
                                    <a href={manga.download_link} target="_blank" rel="noopener noreferrer">
                                        <ContentLinksButton variant="contained" fullWidth>
                                            <Typography variant="h6">Mangayı İndir</Typography>
                                        </ContentLinksButton>
                                    </a>
                                    :
                                    ""
                                }
                                {manga.mos_link ?
                                    <a href={manga.mos_link} target="_blank" rel="noopener noreferrer">
                                        <ContentLinksButton variant="contained" fullWidth>
                                            <Typography variant="h6">Mangayı oku</Typography>
                                        </ContentLinksButton>
                                    </a>
                                    :
                                    ""
                                }
                            </ContentLinks>
                        </Grid>
                    </Box>
                    <ContentRightAltTitle variant="h4" aftercolor={theme.palette.text.primary}>Yorumlar</ContentRightAltTitle>
                    <Box {...defaultBoxProps} mb={2} p={2}>
                        <ContentCommentsContainer
                            config={{
                                identifier: 'manga/' + manga.id,
                                title: manga.name + " - PuzzleSubs Manga",
                            }} />
                    </Box>
                </ContentRight>
            </Grid>
        </Content>
    )
}