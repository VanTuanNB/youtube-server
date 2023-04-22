export default interface IVideo {
    _id: string;
    title: string;
    keywordSuggest: string;
    thumbnail: string;
    embed: {
        iframeUrl: string;
    };
    resourceOwner: string;
    category: string;
    dislikeCount?: string;
    likeCount?: string;
    viewCount?: string;
    createdAt?: Date;
    updatedAt?: Date;
}
