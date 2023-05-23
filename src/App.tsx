import {
  postNewTweet,
  putEditTweet,
  deleteAllTweets,
  deleteTweetById,
} from "./client";
import React from "react";
import { queryClient } from "./index";
import { useQuery } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";

type TweetProps = {
  textbox: string;
  id: number;
};

type EditInput = { id: number; newWord: string };

function Tweet(props: TweetProps) {
  const editRef = React.useRef<HTMLTextAreaElement | null>(null);
  const [isEditing, setEditing] = React.useState(false);
  const id = props.id;

  const deleteMutator = useMutation({
    mutationFn: (id: number) => deleteTweetById(id),
    onSuccess: (_, deletedTweetID) => {
      queryClient.setQueryData<QueryData>(["tweets"], (tweets) => {
        if (tweets == null) {
          throw new Error("What the hetch man");
        }

        const copy = [...tweets];

        for (let i = 0; i < copy.length; i++) {
          const tweet = copy[i];
          if (tweet.id === deletedTweetID) {
            copy.splice(i, 1);
            break;
          }
        }

        return copy;
      });
    },
  });

  const editMutator = useMutation(
    (obj: EditInput) => putEditTweet(obj.id, obj.newWord),
    {
      onSuccess: (_, variables) => {
        queryClient.setQueryData<QueryData>(["tweets"], (tweets) => {
          if (tweets == null) {
            throw new Error(
              "Tried to edit tweets somehow when they do not exist???"
            );
          }

          const copy = [...tweets];

          for (let i = 0; i < copy.length; i++) {
            const tweet = copy[i];
            if (tweet.id === variables.id) {
              copy[i] = {
                ...tweet,
                value: variables.newWord,
              };
              break;
            }
          }

          return copy;
        });
      },
    }
  );

  const handleCancel = () => {
    setEditing(false);
  };

  const handleEdit = () => {
    setEditing(true);
  };

  const handleConfirm = () => {
    if (editRef.current == null) {
      throw new Error("Solar flare has flipped a bit :(");
    }

    const textAreaWord = editRef.current.value;
    editMutator.mutate({ id, newWord: textAreaWord });
    setEditing(false);
  };

  if (!isEditing) {
    return (
      <li className="tweet">
        <div className="profile-picture"></div>
        <div className="tweet-contents">
          <p className="tweet-text">{props.textbox}</p>
          <div className="tweet-edit-buttons">
            <button className="button" onClick={handleEdit}>
              Edit
            </button>
            <button className="button" onClick={() => deleteMutator.mutate(id)}>
              Delete
            </button>
          </div>
        </div>
      </li>
    );
  }
  return (
    <li>
      <textarea
        className="editbox"
        ref={editRef}
        defaultValue={props.textbox}
      />{" "}
      <br />
      <button onClick={handleConfirm}>Confirm</button>
      <button onClick={handleCancel}>Cancel</button>
    </li>
  );
}

type TweetObj = { id: number; value: string };
type QueryData = Array<TweetObj>;

function App() {
  const textRef = React.useRef<HTMLTextAreaElement | null>(null);
  const query = useQuery<QueryData>(["tweets"], () =>
    fetch("http://localhost:3001/tweets").then((res) => res.json())
  );

  const createMutator = useMutation(
    (newTweet: string) => postNewTweet(newTweet),
    {
      onSuccess: (newlyCreatedTweet, _) => {
        queryClient.setQueryData<QueryData>(["tweets"], (tweets) => {
          if (tweets == null) {
            return [newlyCreatedTweet];
          }
          return [newlyCreatedTweet, ...tweets];
        });
      },
    }
  );

  const deleteAllMutator = useMutation(() => deleteAllTweets(), {
    onSuccess: () => {
      queryClient.setQueryData<QueryData>(["tweets"], []);
    },
  });

  const handleSubmit = () => {
    if (textRef.current == null) {
      return;
    }

    createMutator.mutate(textRef.current.value);
    textRef.current.value = "";
  };

  const handleDeleteAll = () => {
    deleteAllMutator.mutate();
  };

  if (query.data == null) {
    return (
      <div>
        <h1>Loading</h1>
      </div>
    );
  }

  const tweetElements = query.data.map((tweet) => {
    const id = tweet.id;

    return <Tweet textbox={tweet.value} key={id} id={id} />;
  });

  return (
    <div className="root">
      <h1 className="title">Media</h1>
      <div className="input-stuff">
        <div className="profile-picture"></div>
        <div className="input-container">
          <textarea placeholder="What's going on?" className="textbox" ref={textRef} rows={10} cols={30} />
          <div className="post-delete">
            <button className="button" onClick={handleSubmit}>Post</button>
            <button className="button" onClick={handleDeleteAll}>Delete All</button>
          </div>
        </div>
      </div>
      <ul className="my-list">{tweetElements}</ul>
    </div>
  );
}

export default App;
