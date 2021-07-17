import axios from "axios";
import Head from "next/head";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();
  const { ids } = router.query;

  const [friend, setFriend] = useState(["", ""]);
  const [data, setData] = useState([]);
  const [textShare, setTextShare] = useState("แชร์");
  const findGroup = async (_friend) => {
    const { data } = await axios.get("/api/match?ids=" + _friend.join(","));
    console.log(data);
    setData(data);
  };
  useEffect(() => {
    if (ids != undefined) {
      setFriend(ids.split(",").filter((a) => a != ""));
      findGroup(ids.split(",").filter((a) => a != ""));
    }
  }, [ids]);
  return (
    <div className="w-screen h-screen bg-gray-100 pt-12 overflow-scroll">
      <div className="max-w-lg mx-auto w-full pl-2 pr-2">
        <div className="text-xl font-bold bg-white p-5 rounded-lg shadow-lg">
          หาเพื่อนเซค !
          {friend.map((x, i) => (
            <input
              type="text"
              className="border w-full mt-2 p-1 rounded font-thin text-sm"
              placeholder={"รหัสนิสิตคนที่ " + (i + 1)}
              value={x}
              onChange={(e) => {
                setFriend(
                  friend.map((y, _i) => {
                    if (i == _i) {
                      return e.target.value;
                    } else {
                      return y;
                    }
                  })
                );
              }}
            />
          ))}
          <div className="font-thin text-xl flex  justify-end">
            <div
              onClick={() => findGroup(friend)}
              className="cursor-pointer rounded bg-green-500 text-sm text-white p-1 mr-2 mt-2"
            >
              จัดกลุ่ม
            </div>
            <div
              onClick={() => setFriend([...friend, ""])}
              className="cursor-pointer rounded bg-green-500 text-sm text-white p-1 mt-2"
            >
              เพิ่มคน
            </div>
            <div
              onClick={() => {
                var text =
                  "https://reg-matcher.vercel.app/?ids=" + friend.join(",");
                navigator.clipboard.writeText(text).then(
                  function () {
                    setTextShare("คัดลอกลิ้งเรียบร้อย!");
                  },
                  function (err) {
                    console.error("Async: Could not copy text: ", err);
                  }
                );
              }}
              className="cursor-pointer ml-2 rounded bg-yellow-500 text-sm text-white p-1 mr-2 mt-2"
            >
              {textShare}
            </div>
          </div>
          <div className="overflow-scroll vh-50">
            <div className="border border-gray-200 mt-5 mb-3"></div>
            {data.map(({ code, name, section, participants }) => {
              return (
                <div className="mt-2 text-base">
                  <div className="flex ">
                    <div className="font-thin">วิชา {name}</div>
                    <div className="flex flex-col ml-1 bg-yellow-500 text-white rounded pl-1 pr-1 justify-end">
                      <div className="font-thin text-sm">Sec {section}</div>
                    </div>
                  </div>

                  <div className="font-thin text-sm">รหัสวิชา {code}</div>
                  <div className="flex font-thin text-sm">
                    <div className="bold">สมาชิก</div> :{" "}
                    {participants.join(", ")}
                  </div>
                  <div className="border border-gray-200 mt-2 mb-3"></div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
