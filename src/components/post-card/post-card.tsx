import React, { createRef, useRef, useMemo } from "react";
import { Link } from "gatsby";
import cardStyles from "./post-card.module.scss";
import { stopPropCallback } from "../../utils";
import { UserProfilePic } from "../user-profile-pic";
import { UnicornInfo } from "../../types";
import TransitionLink from "gatsby-plugin-transition-link";

interface PostCardProps {
	title: string; // The title of the post
	authors: UnicornInfo[]; // Info on the authors of the post
	published: string; // Date the author published the post
	tags: string[]; // List of tags associated with the post
	excerpt: string; // The autogenerated excerpt from the GraphQL call
	slug: string; // The post URL slug (which is also it's unique ID)
	description?: string; // The manually written description of the post in the post frontmatter
	className?: string; // Classname to pass to the post card element
}

export const PostCard = ({
	title,
	authors,
	published,
	tags,
	excerpt,
	description,
	className,
	slug
}: PostCardProps) => {
	const headerLink = useRef<HTMLElement>();
	const authorLinks = useMemo(
		() =>
			authors.map(unicorn => {
				const ref = createRef<HTMLElement>();
				const onClick = (e: MouseEvent) => {
					stopPropCallback(e);
					ref.current!.click();
				};

				return {
					unicorn,
					onClick,
					ref
				};
			}),
		[authors]
	);

	return (
		<li
			className={`${cardStyles.card} ${className}`}
			onClick={() => headerLink.current!.click()}
			role="listitem"
		>
			<div className={cardStyles.cardContents}>
				<TransitionLink
					to={`/posts${slug}`}
					onClick={stopPropCallback as any}
					className="unlink"
					entry={{
						state: { isEntryPage: true }
					}}
					exit={{
						state: { isEntryPage: false },
						length: 0.6
					}}
				>
					<h2 className={cardStyles.header} ref={headerLink as any}>
						{title}
					</h2>
				</TransitionLink>
				<p className={cardStyles.authorName}>
					<span>by&nbsp;</span>
					<Link
						to={`/unicorns/${authors[0].id}`}
						className={cardStyles.authorLink}
						ref={authorLinks[0].ref as any}
						onClick={e => e.stopPropagation()}
					>
						{authors[0].name}
					</Link>
					{/* To avoid having commas on the first author name, we did this */}
					{authors.slice(1).map((author, i) => {
						return (
							<React.Fragment key={author.id}>
								<span>, </span>
								<Link
									key={author.id}
									to={`/unicorns/${author.id}`}
									className={cardStyles.authorLink}
									ref={authorLinks[i].ref as any}
									onClick={e => e.stopPropagation()}
								>
									{author.name}
								</Link>
							</React.Fragment>
						);
					})}
				</p>
				<div className={cardStyles.dateTagSubheader}>
					<p className={cardStyles.date}>{published}</p>
					<div>
						{tags.map(tag => (
							<span key={tag} className={cardStyles.tag}>
								{tag}
							</span>
						))}
					</div>
				</div>
				<p
					className={cardStyles.excerpt}
					dangerouslySetInnerHTML={{
						__html: description || excerpt
					}}
				/>
			</div>
			<UserProfilePic
				authors={authorLinks as any}
				className={cardStyles.authorImagesContainer}
			/>
		</li>
	);
};
