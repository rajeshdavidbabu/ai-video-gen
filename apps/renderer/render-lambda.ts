import { getFunctions, estimatePrice } from "@remotion/lambda";
import {
  renderMediaOnLambda,
  getRenderProgress,
} from "@remotion/lambda/client";

async function main() {
  const functions = await getFunctions({
    region: "us-east-1",
    compatibleOnly: true,
  });

  const functionName = functions[0].functionName;

  console.log(functionName);

  const inputProps = {
    imageUrls: [
      "https://images.unsplash.com/uploads/1413387620228d142bee4/23eceb86",
      "https://images.unsplash.com/reserve/jEs6K0y1SbK3DAvgrBe5_IMG_3410.jpg",
      "https://images.unsplash.com/uploads/141219200475673afcb68/f5bd8360",
      "https://images.unsplash.com/reserve/ijl3tATFRpCjKWXwUoBz_DSCF7168.jpg",
      "https://images.unsplash.com/reserve/6vaWXsQuSWSgm5NEF2p9_WC4A4194.jpg",
      "https://images.unsplash.com/photo-1415340839394-8e0c3c29672c",
      "https://images.unsplash.com/photo-1431263154979-0982327fccbb",
    ],
    backgroundMusicUrl:
      "https://rajesh-babu-sample-data.s3.eu-central-1.amazonaws.com/bg-music.mp3?response-content-disposition=inline&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Security-Token=IQoJb3JpZ2luX2VjED8aDGV1LWNlbnRyYWwtMSJIMEYCIQD7JFTH16A3eWBayqpl6DA%2BTh1OhjorQIaDqxA6HvcRjQIhAK0XiTd6BmN8wJXw6Jg9ZKPvGG%2FJK8L59ZyPmAr7D0XTKtQDCNj%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQARoMOTk2OTE3MDA1NDk1IgzpLZl2moJ5IMYrnpcqqANiY%2BGJuQf3gyrDT3xWCcANSfnet382uLY75fVyB6aBsiQWhOw6y4qaIGDFgKsPd1hSHCRw7VUNBuPxA38aLmHiFflf2qHdMHbAIJnaPFJeKr87TIJEdXUyUt%2Bi%2BeDiKVqlstyvEWHnBMOunzHPVVyNctQa0HVaw1GqhodX9oBZRoq11NO%2B%2FFy%2B8E7Xu9mTdReWLFheaK60akIOlSlZcmaDVqrq1DlKYWyQBAa%2FihtQalSWHKoTDn6csW6z5noUmf%2FMzKZtz9uyyjwf%2BRgeoYvisZAkDqUlfVW08uymynvlpDlcuoN5la4l2FNl%2Bu1C6ZIoV4SWx%2BCuMZP9S%2F6ZGnPerDCDG10zsp53MGZgAXQXmm8rv6gOM8BgJyhj0fVG%2BwRIK%2Fv3euSN0gMrt%2F3RhELJ9yuU8S7NZwzBwyK9MY86QJYzo74f3pNof9%2BqeYAyGJX8fUzjic2mHWVyvOFxilAVEWE8sVL8Mxb5veLbAs%2F2u6OCm9eZC4vqWJUHKCAAl1sAWBHNbSdKDabB%2FceRE1MMiSOP0pS1%2BQptSq%2BNon3w8JeSyBlI2DH9MIuPh7oGOuMCZe2pPVPBpCPzgugHMuvA1Y84WGik%2F%2BlbiyWwRH78lzAGuLjpxhCBcbmqzkaLPjXKluqsmJGWMqDXesymssIH4U2Jc7GyAPSwnSa7jdB3tdH63P%2FoiIFO9nKxA2IJB%2BnGp8JA2KMEZ7xU4g8tEUoBc7wroLsXCx33wBa85bleOCnHAD8f8yYEW9FgJB68PRNqOe71PGUdBqtX6QYU6uSEHt%2FM4GC5r6uOjMse6NqXlm3K0hzVK%2BAsoM9ckCsH%2BV3CQYoX7m4F2VYVEBvUF5B28WJCNoNzmjjrNhPtncJpfPaxWdS5HFw%2Bq5OBYGBQ71qadVQP85fAJp%2FFO9FIFTBy1f%2FDfFGq2gFOyQ05vnW7nnFsbDnx9xdsr6%2BybWEKygw9uL%2FGf54dVkkAGB4PbgwD06vtkiVScgAa7yS5QGu3k50DyzJ9tHz3coRDBFUM%2F4lyu1RqhutBG7zKikkqm%2F4AYDOZfA%3D%3D&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=ASIA6QHHCJS3S4WOGKUW%2F20241123%2Feu-central-1%2Fs3%2Faws4_request&X-Amz-Date=20241123T143639Z&X-Amz-Expires=43200&X-Amz-SignedHeaders=host&X-Amz-Signature=c07663c12debcc2582fb8b1bccc21e4149f0861e6f8303f6f0385155007d9c82",
    narrationUrl:
      "https://bullmq-job-assets-storage.s3.us-east-1.amazonaws.com/20c151ed-a63a-4eec-babd-03dc7e30bf39/audio.mp3?response-content-disposition=inline&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Security-Token=IQoJb3JpZ2luX2VjED8aCXVzLWVhc3QtMSJHMEUCIQCYAJUT1%2BGHUD4m9ZcokIH37hEljxnZFI1dm2CDvNWQewIgFPFoyN41DrWpeto9bad1rItaj%2BBtHq3ept6Qzxh%2FEf0q1AMI2P%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARABGgw5OTY5MTcwMDU0OTUiDJUslTT4QdaGLX%2FgTSqoA8Dux2plKyFW2fhtHuaMFxjmckfkP6vtWmjupwKjWfUHJZ4S8LnUpkktYTHAo1kI%2FVQdBU5diN4%2BEcLx1b8fBh7finQPLmMMQB%2F%2FWfxUatjPL%2Fhfqm4%2FZUfVG6mXpKprc6cUmFoX8ZXIc29ocuFD%2BsVnPZMNij8l2te8BWE4B6dV8q%2Fl8lDN7TlEg6M7ESiAQ%2F93tZl4uS9MikHkvgHeZsC59wV%2FNzSAiGi9uDDj6NJeUhCZCrJW0VYd23WVDklbU8UFh3aF3YW3%2FtWLUIu2P6%2Bs%2Fi8OF8n44Y%2BE1XBAkMKyNDSnBK41unbxhHXIGIcQy3dFn6V7wFsDfVX51ZFFmOkThwkWsT9Mp9AlP%2B2itbShhw3cZuvevifp%2F8YsTiMAezySI60TsasUUWd1r3BSegsGF0kzu%2FrojIo46JKb8hYZq%2FQOVwVSKYEIcvT6SBzTDwcMPzwcKi98oO23BzlsvOXl%2FmnmjgwfNhzY%2FI7GRvXhwjkxb2IwDUqkeLfWvlPcGQEiDOWm8mmoU7h%2FvDIgGiDwX0nzcdA2hOQfwniUb%2FKNXe7Ae9uRVXYwi4%2BHugY65AKVe%2Bw4OnKLjxSjUEeh9hKUIpqm19%2FCGGLxVU0sh7JOhD%2BOozbQARs5HN%2B1ouRvqAW30noc%2FQbrT%2FiCrx5lfdro9YS2xOGuR5CaxSamsTvt91EPfBTO3I2WRxsylzS%2Fd9Y4FVntm2ve1InSDMugxFFL2d2tyaNuGIItKx8JOSzzeXys9IueMghzJWZDYwrVvbLNvuuQR%2FF4K7Rtq2PuYpHjwx1FojpiPhiAset%2BMFmnlgP%2FKKxvAiS0qLRPnT5Vnpw5a5cOgMJjvImn48iDUi%2BDqSmtFFuSkkhhLH7poIGFQBtLvExGg9k6Igdzy3cd8akeLes%2BYOtHBMBhlWDiUYNXQXRX%2FjgEpCUa4nDD0M6W87x7exfQgHaHmlvZTSfhlyt72UzcnFVP8mPxKZEmROuYc7o3DigHpc%2Bosn7oGk%2F%2BMFywxLObt4v5iAQPvp6Sm4hsVOmHh5hfz6kemqJ%2BKC%2BPSEZPRQ%3D%3D&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=ASIA6QHHCJS3TWCWHBBR%2F20241123%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20241123T143516Z&X-Amz-Expires=43200&X-Amz-SignedHeaders=host&X-Amz-Signature=4d244003e9b0345c16ef73da53cd205598aa98bd72075deb6e3d1e82c004aae8",
    captionsUrl:
      "https://bullmq-job-assets-storage.s3.us-east-1.amazonaws.com/20c151ed-a63a-4eec-babd-03dc7e30bf39/captions.json?response-content-disposition=inline&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Security-Token=IQoJb3JpZ2luX2VjED8aCXVzLWVhc3QtMSJHMEUCIQCYAJUT1%2BGHUD4m9ZcokIH37hEljxnZFI1dm2CDvNWQewIgFPFoyN41DrWpeto9bad1rItaj%2BBtHq3ept6Qzxh%2FEf0q1AMI2P%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARABGgw5OTY5MTcwMDU0OTUiDJUslTT4QdaGLX%2FgTSqoA8Dux2plKyFW2fhtHuaMFxjmckfkP6vtWmjupwKjWfUHJZ4S8LnUpkktYTHAo1kI%2FVQdBU5diN4%2BEcLx1b8fBh7finQPLmMMQB%2F%2FWfxUatjPL%2Fhfqm4%2FZUfVG6mXpKprc6cUmFoX8ZXIc29ocuFD%2BsVnPZMNij8l2te8BWE4B6dV8q%2Fl8lDN7TlEg6M7ESiAQ%2F93tZl4uS9MikHkvgHeZsC59wV%2FNzSAiGi9uDDj6NJeUhCZCrJW0VYd23WVDklbU8UFh3aF3YW3%2FtWLUIu2P6%2Bs%2Fi8OF8n44Y%2BE1XBAkMKyNDSnBK41unbxhHXIGIcQy3dFn6V7wFsDfVX51ZFFmOkThwkWsT9Mp9AlP%2B2itbShhw3cZuvevifp%2F8YsTiMAezySI60TsasUUWd1r3BSegsGF0kzu%2FrojIo46JKb8hYZq%2FQOVwVSKYEIcvT6SBzTDwcMPzwcKi98oO23BzlsvOXl%2FmnmjgwfNhzY%2FI7GRvXhwjkxb2IwDUqkeLfWvlPcGQEiDOWm8mmoU7h%2FvDIgGiDwX0nzcdA2hOQfwniUb%2FKNXe7Ae9uRVXYwi4%2BHugY65AKVe%2Bw4OnKLjxSjUEeh9hKUIpqm19%2FCGGLxVU0sh7JOhD%2BOozbQARs5HN%2B1ouRvqAW30noc%2FQbrT%2FiCrx5lfdro9YS2xOGuR5CaxSamsTvt91EPfBTO3I2WRxsylzS%2Fd9Y4FVntm2ve1InSDMugxFFL2d2tyaNuGIItKx8JOSzzeXys9IueMghzJWZDYwrVvbLNvuuQR%2FF4K7Rtq2PuYpHjwx1FojpiPhiAset%2BMFmnlgP%2FKKxvAiS0qLRPnT5Vnpw5a5cOgMJjvImn48iDUi%2BDqSmtFFuSkkhhLH7poIGFQBtLvExGg9k6Igdzy3cd8akeLes%2BYOtHBMBhlWDiUYNXQXRX%2FjgEpCUa4nDD0M6W87x7exfQgHaHmlvZTSfhlyt72UzcnFVP8mPxKZEmROuYc7o3DigHpc%2Bosn7oGk%2F%2BMFywxLObt4v5iAQPvp6Sm4hsVOmHh5hfz6kemqJ%2BKC%2BPSEZPRQ%3D%3D&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=ASIA6QHHCJS3TWCWHBBR%2F20241123%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20241123T143554Z&X-Amz-Expires=43200&X-Amz-SignedHeaders=host&X-Amz-Signature=0186d0e6e189d0bc7076ec0cb1bd61cf5fb12eb82e31c9969ed5ff5bf210f7a9",
    fontFamily: "MerriweatherUltrabold",
    fontColor: "red",
    imageEffect: "horizontal-pan",
    overlay: "sparkles",
    transition: "fade",
    captionAlignment: "center",
  };

  const { renderId, bucketName } = await renderMediaOnLambda({
    region: "us-east-1",
    functionName,
    serveUrl:
      "https://remotionlambda-useast1-vbh18muh64.s3.us-east-1.amazonaws.com/sites/simple-video/index.html",
    composition: "SimpleVideo",
    inputProps,
    codec: "h264",
    imageFormat: "jpeg",
    maxRetries: 1,
    framesPerLambda: 40,
    privacy: "public",
    logLevel: "verbose",
  });

  while (true) {
    console.log("Waiting for render to finish...", renderId);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const progress = await getRenderProgress({
      renderId,
      bucketName,
      functionName,
      region: "us-east-1",
    });
    if (progress.done) {
      console.log("Render finished!", progress.outputFile);
      console.log(
        "Estimated cost so far:",
        JSON.stringify(progress.costs, null, 2)
      );
      process.exit(0);
    }
    if (progress.fatalErrorEncountered) {
      console.error("Error ", progress.errors);
      process.exit(1);
    }
  }
}

main();
