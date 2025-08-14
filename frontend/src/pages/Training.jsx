import React, { useState } from "react";
import pythonImg from "../assets/python.png";
import javascriptImg from "../assets/javascript.png";
import javaImg from "../assets/java.png";
import video1 from "../assets/sample-1.mp4";
import video2 from "../assets/sample-2.mp4";
import video3 from "../assets/sample-3.mp4";
import video4 from "../assets/sample-4.mp4";
import video5 from "../assets/sample-5.mp4";

const Training = () => {
  const [loadingImages, setLoadingImages] = useState({
    python: true,
    javascript: true,
    java: true,
  });

  const handleImageLoad = (imageName) => {
    setLoadingImages((prev) => ({ ...prev, [imageName]: false }));
  };

  const handleImageError = (imageName) => {
    setLoadingImages((prev) => ({ ...prev, [imageName]: false }));
  };

  return (
    <div className="mx-6">
      {/* Quote */}
      <div className="m-16 italic text-2xl">
        <blockquote className="text-center break-words">
          <p>""The beautiful thing about learning is that nobody can take it away from you."</p>
          <div className="mt-5 text-center">
            <p>―B.B. King</p>
          </div>
        </blockquote>
      </div>

      {/* Course Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 p-10">
        {/* python */}
        <div className="card bg-white rounded-lg shadow-lg overflow-hidden hover:scale-105 transform transition duration-300">
          <div className="relative overflow-hidden">
            {loadingImages.python && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                <span className="text-gray-500">Loading...</span>
              </div>
            )}
            <img
              className={`w-full h-48 object-contain p-4 group-hover:opacity-75 transition-opacity duration-300 ${
                loadingImages.python ? "opacity-0" : "opacity-100"
              }`}
              src={pythonImg}
              alt="Python Programming"
              onLoad={() => handleImageLoad("python")}
              onError={() => handleImageError("python")}
              data-testid="python-image"
            />
          </div>
          <div className="p-6">
            <h3 className="text-xl font-semibold">Python Development</h3>
            <p className="mt-2 text-gray-600">
              Master Python programming with Microsoft's professional certification. Learn essential development skills, from basic syntax to advanced concepts and real-world applications.
            </p>
            <a
              href="https://www.coursera.org/professional-certificates/microsoft-python-developer/paidmedia?utm_medium=sem&utm_source=gg&utm_campaign=b2c_apac_microsoft-python-developer_microsoft_ftcof_professional-certificates_px_dr_bau_gg_sem_pr_s2-v2_all_m_hyb_25-05_x&campaignid=22531063352&adgroupid=180903671404&device=c&keyword=coursera%20learn%20python&matchtype=p&network=g&devicemodel=&creativeid=751062154495&assetgroupid=&targetid=kwd-382718365369&extensionid=&placement=&gad_source=1&gad_campaignid=22531063352&gbraid=0AAAAADdKX6byaiO6xkAwtGMJ7vaAHeT1s&gclid=Cj0KCQjwiqbBBhCAARIsAJSfZkb8jq-1ijxhrLRGYyEtJ6IcqL4NSzfUKQUbf-hJO5O-sgB5AZkE1CYaAnC7EALw_wcB"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--Light)] mt-4 inline-block hover:underline cursor-pointer"
            >
              Learn More
            </a>
          </div>
        </div>

        {/* javascript */}
        <div className="card bg-white rounded-lg shadow-lg overflow-hidden hover:scale-105 transform transition duration-300">
          <div className="relative overflow-hidden">
            {loadingImages.javascript && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                <span className="text-gray-500">Loading...</span>
              </div>
            )}
            <img
              className={`w-full h-48 object-contain p-4 group-hover:opacity-75 transition-opacity duration-300 ${
                loadingImages.javascript ? "opacity-0" : "opacity-100"
              }`}
              src={javascriptImg}
              alt="JavaScript Programming"
              onLoad={() => handleImageLoad("javascript")}
              onError={() => handleImageError("javascript")}
              data-testid="javascript-image"
            />
          </div>
          <div className="p-6">
            <h3 className="text-xl font-semibold">HTML, CSS & JavaScript Fundamentals</h3>
            <p className="mt-2 text-gray-600">
              Learn the core technologies of web development. Master HTML for structure, CSS for styling, and JavaScript for interactive web applications.
            </p>
            <a
              href="https://www.coursera.org/learn/introduction-html-css-javascript?utm_medium=sem&utm_source=gg&utm_campaign=b2c_apac_ibm-ios-android-mobile-app-developer-pc_ibm_ftcof_professional-certificates_px_dr_bau_gg_sem_pr_s2-v2_all_m_hyb_25-05_x&campaignid=22524699540&adgroupid=177955414983&device=c&keyword=&matchtype=&network=g&devicemodel=&creativeid=751038449241&assetgroupid=&targetid=dsa-2366459914698&extensionid=&placement=&gad_source=1&gad_campaignid=22524699540&gbraid=0AAAAADdKX6aSAhcEhxAAb7d_WZF7XAbg3&gclid=Cj0KCQjwiqbBBhCAARIsAJSfZkavStq59_U8aG6LIVwlG8uUFvl69rRmLBWzN3Znns2NPQdfv37xlsUaAgiREALw_wcB"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--Light)] mt-4 inline-block hover:underline cursor-pointer"
            >
              Learn More
            </a>
          </div>
        </div>

        {/* java */}
        <div className="card bg-white rounded-lg shadow-lg overflow-hidden hover:scale-105 transform transition duration-300">
          <div className="relative overflow-hidden">
            {loadingImages.java && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                <span className="text-gray-500">Loading...</span>
              </div>
            )}
            <img
              className={`w-full h-48 object-contain p-4 group-hover:opacity-75 transition-opacity duration-300 ${
                loadingImages.java ? "opacity-0" : "opacity-100"
              }`}
              src={javaImg}
              alt="Java Programming"
              onLoad={() => handleImageLoad("java")}
              onError={() => handleImageError("java")}
              data-testid="java-image"
            />
          </div>
          <div className="p-6">
            <h3 className="text-xl font-semibold">Java SE Programming</h3>
            <p className="mt-2 text-gray-600">
              Comprehensive Java programming course covering Java SE fundamentals. Learn object-oriented programming, data structures, and essential Java concepts for professional development.
            </p>
            <a
              href="https://www.udemy.com/course/java-se-programming/?utm_source=adwords&utm_medium=udemyads&utm_campaign=Search_Keyword_Beta_Prof_la.EN_cc.ROW-English&campaigntype=Search&portfolio=ROW-English&language=EN&product=Course&test=&audience=Keyword&topic=Java&priority=Beta&utm_content=deal4584&utm_term=_._ag_159583860374_._ad_696233877550_._kw_java+learn_._de_c_._dm__._pl__._ti_kwd-338485930783_._li_9198978_._pd__._&matchtype=b&gad_source=1&gad_campaignid=21178661965&gbraid=0AAAAADROdO1ABO_K3DOKBSo1pIR7NmQrj&gclid=Cj0KCQjwiqbBBhCAARIsAJSfZkbnK_ceUMUpAK34F9GLWzAXxEXt0yGKq42Ang6UB7zcoj2VpkJnFqIaAnaHEALw_wcB&couponCode=CP130525"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--Light)] mt-4 inline-block hover:underline cursor-pointer"
            >
              Learn More
            </a>
          </div>
        </div>
      </div>

      {/* Course Videos */}
      <div className="my-24">
        <h2 className="font-bold text-3xl text-center text-[var(--Brown)] py-10">
          Course Videos
        </h2>
        <div className="flex flex-wrap justify-center gap-5">
          <div className="card bg-gray-200 rounded-lg shadow-md overflow-hidden w-[500px] h-[300px]">
            <video
              data-testid="course-video"
              className="h-full w-full rounded-lg object-cover"
              controls
            >
              <source src={video1} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
          <div className="card bg-gray-200 rounded-lg shadow-md overflow-hidden w-[500px] h-[300px]">
            <video
              data-testid="course-video"
              className="h-full w-full rounded-lg object-cover"
              controls
            >
              <source src={video2} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
          <div className="card bg-gray-200 rounded-lg shadow-md overflow-hidden w-[500px] h-[300px]">
            <video
              data-testid="course-video"
              className="h-full w-full rounded-lg object-cover"
              controls
            >
              <source src={video3} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
          <div className="card bg-gray-200 rounded-lg shadow-md overflow-hidden w-[500px] h-[300px]">
            <video
              data-testid="course-video"
              className="h-full w-full rounded-lg object-cover"
              controls
            >
              <source src={video4} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
          <div className="card bg-gray-200 rounded-lg shadow-md overflow-hidden w-[500px] h-[300px]">
            <video
              data-testid="course-video"
              className="h-full w-full rounded-lg object-cover"
              controls
            >
              <source src={video5} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Training;
