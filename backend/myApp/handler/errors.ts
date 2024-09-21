export function errorHandler(): any {
    return (err, req, res, next) => {
        console.log(err);
      if (err.name === "SyntaxError") {
        res.status(500).send("Not correct body");
      } else if (err.name === "ValidationError") {
        // console.log(err);
        res.status(500).send("Validation error");
      } else {
        res.status(500).send("Something broke!");
      }
    };
  }